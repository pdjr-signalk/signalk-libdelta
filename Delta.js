
/**********************************************************************
 * Copyright 2020 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You
 * may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

module.exports = class Delta {

  constructor(app, source) {
    this.app = app;
    this.source = source;
    this.values = [];
    this.metas = [];
  }

  clear() {
    this.values = [];
    this.metas = [];
  }

  addValue(path, value) {
    this.values.push({ "path": path, "value": value });
  }

  addMeta(path, value) {
    this.metas.push({ "path": path, "value": value });
  }

  commit() {
    var delta = { updates: [ ] };
    if (this.values.length) {
      delta.updates.push({
        source: { type: "plugin", src: this.source },
        timestamp: (new Date()).toISOString(),
        values: this.values 
      });
    }
    if (this.metas.length) {
      delta.updates.push({
        meta: this.metas
      });
    }
    this.app.sendMessage(this.source, delta);
  }

}
