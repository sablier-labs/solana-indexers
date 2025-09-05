import _ from "lodash-es";

import { getCreateCampaignDecoder } from "../../apps/airdrops-subquery/src/types/program-interfaces/GrZhWdwBgZakydbyUMx1eTkCT5Eei7LC21i87Ag7Vh1D/types/createCampaign";

const logWithProgramData =
  "Program data: WLLUSG4ERI+AjVsAAAAAAH2eGXoJYhhDTE+7rPkVnAp3LaC5ETTwOIt5yw/D7Xi4AgAAAEE09gejaAAAAADUVXzigmOuXR1BeW3k3pLnxFXL+31+xCnnlD0hf4+ON2xZpGgAAAAALgAAAFFtUGdRZm9VQTM0SGhQeEUxckVmOUFXcVdpZXE5QzQ2dUtrakVyTm8xYTRxRFFw1ASk1sFZhwY7seF0QEMNy230n1UfTt91o5V62NHkOgIAAAAGUMq6eoSkyuAne5h9tsY3/BWdi2/jrVe8AR2hFHpWSWI=";

// Strip program data and convert log to Uint8Array
function formatLogToUint8Array(
  logWithProgramData: string
): [Uint8Array, string] {
  const base64 = logWithProgramData.split("Program data: ")[1]?.trim();
  const uint8Array = new Uint8Array(Buffer.from(base64, "base64"));

  return [uint8Array, base64];
}

export function decode() {
  const [log] = formatLogToUint8Array(logWithProgramData);

  const decoder = getCreateCampaignDecoder();

  const value = decoder.decode(log.subarray(8), 0);

  console.log({
    log,
    value
  });
}

decode();
