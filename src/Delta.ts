
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

import * as _ from 'lodash'

class Delta {

  private app: any
  private source: string
  private values: { path: string, value: any }[] = []
  private metas: { path: string, value: any }[] = []

  constructor(app: any, source: string) {
    this.app = app
    this.source = source
  }

  clear(): Delta {
    this.values = []
    this.metas = []
    return(this)
  }

  addValue(path: string, value: any): Delta {
    this.values.push({ "path": path, "value": value });
    return(this);
  }

  addValues(values: any): Delta {
    if (_.isArray(values)) {
      values.forEach((v: any) => this.addValue(v.path, v.value));
    } else if (_.isObject(values)) {
      for (const [k, v] of Object.entries(values)) { this.addValue(k, v) }
    } else throw new Error('argument must be an array or an object');
    return(this);
  }

  addMeta(path: string, value: any): Delta {
    this.metas.push({ "path": path, "value": value });
    return(this);
  }

  addMetas(values: any): Delta {
    if (_.isArray(values)) {
      values.forEach((v: any) => this.addMeta(v.path, v.value));
    } else if (_.isObject(values)) {
      for (const [k, v] of Object.entries(values)) { this.addMeta(k, v) };
    } else throw new Error('argument must be an array or an object');
    return(this);
  }

  count(): number {
    return(this.values.length + this.metas.length);
  }

  commit(dump: number = 0): Delta {
    if ((this.values.length) || (this.metas.length)) {
      var delta: any = { updates: [] };
      if (this.values.length) {
        delta.updates.push({ source: { type: "plugin", src: this.source }, timestamp: (new Date()).toISOString(), values: this.values });
      }
      if (this.metas.length) {
        delta.updates.push({ meta: this.metas });
      }
      this.app.handleMessage(this.source, delta);
      if (dump != 0) console.log(JSON.stringify(delta));
    }
    return(this);
  }

  dump() {
     this.commit(2);
  }

}

export = Delta;
