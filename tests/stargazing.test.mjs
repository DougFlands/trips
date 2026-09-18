import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

// Use the project's existing TS compiler; no test framework or runtime package added.
async function moduleUrl(path, dependencies = {}) {
  let { outputText } = ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  for (const [specifier, url] of Object.entries(dependencies)) outputText = outputText.replaceAll(JSON.stringify(specifier), JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
}
const coordinatesUrl = await moduleUrl('../src/lib/coordinates.ts');
const { distanceKm, wgs84ToGcj02 } = await import(coordinatesUrl);
const { places, sortPlaces, shenzhenOrigin, toMapPlace, lightPollutionUrl, tianwentongUrl } = await import(await moduleUrl('../src/trips/guangdong-stargazing/places.ts', { '../../lib/coordinates': coordinatesUrl }));
const weather = await import(await moduleUrl('../src/trips/guangdong-stargazing/weather.ts'));
const point = { id: 'fixture-a', wgs84: [114.06, 22.54] };
const other = { id: 'fixture-b', wgs84: [114.4, 23.1] };
const start = Date.parse('2026-09-08T00:00:00+08:00') / 1000;

function forecast(target, id) {
  return {
    ...(id ? { location_id: id } : {}), latitude: target.wgs84[1], longitude: target.wgs84[0], utc_offset_seconds: 28800,
    hourly_units: { time: 'unixtime', ...Object.fromEntries(weather.fieldNames.map(field => [field, weather.weatherFields[field].unit])) },
    hourly: { time: Array.from({ length: 192 }, (_, i) => start + i * 3600), ...Object.fromEntries(weather.fieldNames.map(field => [field, Array(192).fill(field === 'visibility' ? 10000 : 30)])) },
  };
}

test('known geodesic distance and WGS84→GCJ02 agree with gcoord reference', () => {
  assert.equal(distanceKm(shenzhenOrigin, shenzhenOrigin), 0);
  assert.ok(Math.abs(distanceKm([0, 0], [1, 0]) - 111.1950802) < 0.0001);
  const actual = wgs84ToGcj02([111.867090001, 23.382709602]);
  const reference = [111.872161072, 23.379934890]; // gcoord 1.0.7, verified Yangmeishan POI
  actual.forEach((value, i) => assert.ok(Math.abs(value - reference[i]) < 0.000002));
  assert.deepEqual(wgs84ToGcj02([-74, 40]), [-74, 40]);
});

test('distance/grade sorting is stable, conservative for ranges, unknown always last', () => {
  const references = places.filter(place => ['xichong', 'bajieshan'].includes(place.id));
  assert.equal(sortPlaces(references, 'distance', 'asc')[0].id, 'xichong');
  assert.equal(sortPlaces(references, 'distance', 'desc')[0].id, 'bajieshan');
  for (const source of ['lightPollution', 'tianwentong']) {
    const make = (id, max, wgs84 = [114, 24]) => ({ ...places[0], id, wgs84, [source]: max === null ? null : { min: 2, max } });
    const input = [make('unknown', null), make('b', 4), make('dark', 3), make('a', 4)];
    assert.deepEqual(sortPlaces(input, source, 'asc').map(p => p.id), ['dark', 'a', 'b', 'unknown']);
    assert.deepEqual(sortPlaces(input, source, 'desc').map(p => p.id), ['a', 'b', 'dark', 'unknown']);
    assert.equal(input[0].id, 'unknown');
  }
});

test('map source switches grades without moving the place; links use verified behavior', () => {
  const place = places.find(p => p.id === 'xichong');
  const lp = toMapPlace(place, 'lightPollution'), tw = toMapPlace(place, 'tianwentong');
  assert.equal(lp.markerLabel, '5.5');
  assert.equal(tw.markerLabel, '5.4');
  assert.deepEqual(lp.coord, tw.coord);
  const url = new URL(lightPollutionUrl(place));
  assert.equal(url.hostname, 'lightpollutionmap.app');
  assert.equal(Number(url.searchParams.get('lat')), place.wgs84[1]);
  assert.equal(Number(url.searchParams.get('lng')), place.wgs84[0]);
  assert.equal(tianwentongUrl, 'https://www.darkmap.cn/');
});

test('single/multi API responses map missing first location_id and reordered IDs', () => {
  const a = forecast(point), b = forecast(other, 1);
  a.latitude += 0.01; // model-grid coordinate is intentionally different
  assert.equal(weather.decodeForecast(a, [point])[0].record.placeId, point.id);
  const results = weather.decodeForecast([a, b], [point, other]);
  assert.deepEqual(results.map(r => r.record.placeId), [point.id, other.id]);
  assert.deepEqual(results[0].record.wgs84, point.wgs84);
  assert.deepEqual(weather.decodeForecast([b, { ...a, location_id: 0 }], [point, other]).map(r => r.record.placeId), [point.id, other.id]);
  assert.ok(weather.decodeForecast([a], [point, other]).every(r => r.error));
  assert.ok(weather.decodeForecast([{ ...a, location_id: 1 }, b], [point, other]).every(r => r.error));
});

test('bad units, invalid arrays and ranges fail per point; null remains missing', () => {
  const a = forecast(point), b = forecast(other, 1);
  a.hourly.cloud_cover[0] = null;
  b.hourly.cloud_cover[0] = 101;
  const results = weather.decodeForecast([a, b], [point, other]);
  assert.equal(results[0].record.hours[0].cloud_cover, null);
  assert.ok(results[1].error);
  a.hourly_units.wind_speed_10m = 'm/s';
  assert.ok(weather.decodeForecast(a, [point])[0].error);
  a.hourly_units.wind_speed_10m = 'km/h';
  a.hourly.cloud_cover.pop();
  assert.ok(weather.decodeForecast(a, [point])[0].error);
  assert.deepEqual(weather.weatherSummary([{ cloud_cover: null, precipitation_probability: null }]), { cloud: null, rain: null });
});

test('seven Beijing nights include midnight and last night 05:00, never next 06:00', () => {
  assert.equal(weather.nightDates(Date.parse('2026-09-08T16:30:00Z'))[0], '2026-09-09');
  const record = weather.decodeForecast(forecast(point), [point])[0].record;
  for (const date of weather.nightDates(Date.parse('2026-09-08T10:00:00Z'))) {
    const hours = weather.nightHours(record, date);
    assert.equal(hours.length, 12);
    assert.equal(weather.formatTime(hours[0].time * 1000), '18:00');
    assert.equal(weather.formatTime(hours[6].time * 1000), '00:00');
    assert.equal(weather.formatTime(hours[11].time * 1000), '05:00');
  }
  assert.deepEqual(weather.nightHours(record, '2026-09-17'), []);
});

test('cache decoder rejects changed coordinates, units, schema and damaged times', () => {
  const record = weather.decodeForecast(forecast(point), [point])[0].record;
  assert.equal(weather.validCache(structuredClone(record), point), true);
  assert.equal(weather.validCache({ ...record, version: 2 }, point), false);
  assert.equal(weather.validCache({ ...record, wgs84: [114.06, 23] }, point), false);
  assert.equal(weather.validCache({ ...record, units: { ...record.units, visibility: 'km' } }, point), false);
  const damaged = structuredClone(record); damaged.hours[1].time = damaged.hours[0].time;
  assert.equal(weather.validCache(damaged, point), false);
});

test('catalog contains unique Guangdong references with real sources and grade provenance', () => {
  assert.equal(new Set(places.map(p => p.id)).size, places.length);
  for (const place of places) {
    assert.ok(place.sources.length > 0 && place.sources.every(s => s.url.startsWith('https://www.xiaohongshu.com/explore/')));
    assert.ok(place.wgs84[0] > 109 && place.wgs84[0] < 118 && place.wgs84[1] > 20 && place.wgs84[1] < 26);
    assert.ok(place.coordinateUrl.startsWith('https://'));
    assert.equal('bortle' in place, false);
    for (const source of ['lightPollution', 'tianwentong']) {
      const reading = place[source];
      assert.ok(reading, `${place.id} ${source} missing`);
      assert.ok(reading.min >= 1 && reading.max <= 9 && reading.min <= reading.max);
      assert.ok(reading.sqm > 10 && reading.sqm < 23);
      assert.equal(reading.checkedAt, '2026-09-14');
      assert.ok(reading.matchedLocation);
      if (source === 'lightPollution') {
        assert.equal(reading.year, 2026);
        assert.equal(reading.coordinateSystem, 'WGS84');
        assert.deepEqual(reading.sampledCoordinates, place.wgs84);
      } else {
        assert.equal(reading.year, 2025);
        assert.equal(reading.coordinateSystem, '腾讯地图显示坐标');
        assert.ok(reading.searchQuery);
        // A loose geographic sanity check, not a datum conversion or precision claim.
        assert.ok(distanceKm(place.wgs84, reading.sampledCoordinates) < 10, place.id);
      }
    }
  }
});
