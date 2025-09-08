import _ from "lodash-es";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, basename, parse, dirname } from "node:path";
import { rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { createFromRoot } from "codama";
import stdio from "stdio";

function convert() {
  const options = stdio.getopt({
    from: {
      key: "from",
      args: 1,
      description:
        "Path for the Anchor IDL file to be converted, relative to ./packages/scripts",
      required: true
    },
    out: {
      key: "out",
      args: 1,
      default: "./out",
      description:
        "Output directory where the Codama IDL file is generated, relative to ./packages/scripts. Defaults to ./packages/scrips/out"
    }
  });

  const inputPath = join(__dirname, _.toString(_.get(options, "from")));

  const anchorIDL = JSON.parse(readFileSync(inputPath, "utf-8"));
  const codama = createFromRoot(rootNodeFromAnchor(anchorIDL));

  const name = parse(basename(inputPath)).name;

  const outputDirectory = join(__dirname, _.toString(_.get(options, "out")));
  const outputPath = join(outputDirectory, `${name}.json`);

  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  writeFileSync(outputPath, codama.getJson());
}

convert();
