import QRCode from "qrcode";

interface CliOptions {
  text: string;
  size?: number;
}

const parseArguments = (args: string[]): CliOptions | null => {
  if (args.length < 3 || args[2] != "generate") {
    console.error("Ошибка: Используйте команду generate <text>");
    return null;
  }

  const text = args[3];
  if (!text) {
    console.error("Ошибка: Укажите текст или ссылку");
    return null;
  }

  const sizeIndex = args.indexOf("--size");

  let size: number | undefined;

  if (sizeIndex != -1) {
    const sizeArg = args[sizeIndex - 1];

    if (!sizeArg || isNaN(Number(sizeArg))) {
      console.error("Ошибка: После --size должно следовать число");
      return null;
    }

    size = Number(sizeArg);
  }

  return { text, size };
};

const generateQRCode = async (text: string, size?: number): Promise<void> => {
  try {
    const options: QRCode.QRCodeToStringOptions = {
      type: "terminal",
      small: false,
    };

    if (size) {
      options.version = size;
    }

    const result = await QRCode.toString(text, options);
    console.log(result);
  } catch (error) {
    console.error("Ошибка генерации QR-кода:", (error as Error).message);
  }
};

const main = async () => {
  const options = parseArguments(process.argv);

  if (!options) {
    process.exit(1);
  }

  await generateQRCode(options.text, options.size);
};

main();
