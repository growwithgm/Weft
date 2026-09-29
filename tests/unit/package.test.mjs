import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripRegions } from '../../scripts/src/integrations.mjs';

test('stripRegions removes marked Liquid, liquid-tag and JS regions and keeps the rest', () => {
  const liquid = "a\n{%- comment -%} integration:start {%- endcomment -%}\n{%- render 'integration-x' -%}\n{%- comment -%} integration:end {%- endcomment -%}\nb";
  assert.equal(stripRegions(liquid), 'a\nb');
  const js = 'one();\n  /* integration:start */\n  two();\n  /* integration:end */\nthree();';
  assert.equal(stripRegions(js), 'one();\nthree();');
  const tag = "{%- liquid\n  assign a = 1\n  # integration:start\n  assign b = 2\n  # integration:end\n-%}";
  assert.equal(stripRegions(tag), "{%- liquid\n  assign a = 1\n-%}");
  assert.equal(stripRegions('no markers'), 'no markers');
});

test('stripRegions refuses an unclosed region', () => {
  assert.throws(() => stripRegions('x\n/* integration:start */\ny'), /without integration:end/);
});
