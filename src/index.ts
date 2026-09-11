import * as fs from "node:fs/promises";
import path from "node:path";
import { tmpdir } from "node:os";
import { text } from "node:stream/iter";

const folder = await fs.mkdtemp(path.join(tmpdir(), "fs-example-"));
const file = path.join(folder, "example.txt");
const link = path.join(folder, "link.txt");

try {
    await fs.writeFile(file, "Asdasd", "utf-8");
    await fs.symlink(file, link);

    // 1 Відкриває файл для читання та запису.
    const fileHandle = await fs.open(file, "r+");
    try {
        // 2 Відкриває папку для перегляду її вмісту.
        const directory = await fs.opendir(folder);
        for await (const entry of directory) {
            console.log(entry.name);
        }

        // 3 Повертає список назв файлів і підпапок.
        console.log(await fs.readdir(folder));

        // 4 Читає весь текст із файлу.
        console.log(await fs.readFile(file, "utf-8"));

        // 5 Повертає шлях, на який вказує символічне посилання.
        console.log(await fs.readlink(link));

        // 6 Повертає повний справжній шлях до файлу.
        console.log(await fs.realpath(link));

        // 7 Містить готові значення, наприклад прапорець відкриття лише для читання.
        console.log(fs.constants.O_RDONLY);

        // 8 Читає відкритий файл частинами.
        console.log(await text(fileHandle.pull()));

        // 9 Дозволяє власнику читати й змінювати відкритий файл.
        await fileHandle.chmod(0o600);

        // 10 Змінює права доступу до файлу за його шляхом.
        await fs.chmod(file, 0o600);
    } finally {
        await fileHandle.close();
    }
} catch (error) {}
