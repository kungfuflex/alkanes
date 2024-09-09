import {
  wasmi
} from "./wasmi";

export function loadAlkane(): wasmi.Instance {
  return new wasmi.Instance();
}
