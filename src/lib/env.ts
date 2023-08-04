export default async function (filepath = ".env"): Promise<void> {
  let dotenv: string | undefined

  try {
    dotenv = await Deno.readTextFile(filepath);
  } catch (error) {
    console.error(error);
  }


  if (dotenv) {
    for (const line of dotenv.split("\n")) {
      const [key, value] = line.split("=");
      if (key && value) {
        Deno.env.set(key.trim(), value.trim());
      }
    }
  }
}
