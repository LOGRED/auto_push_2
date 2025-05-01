import chokidar from 'chokidar';
import simpleGit from 'simple-git';
import { copy } from 'fs-extra';

const git = simpleGit();

const detectFolder = `/Users/seonghyeoning/Documents/감시당하는 폴더`

const watcher = chokidar.watch(detectFolder, {
    ignored: ['.git/**', 'node_modules/**'],
    ignoreInitial: true
});

watcher.on('addDir', async (path) => {
    console.log(`Detected ${path}, running git commands…`);

    console.log(path)

    try {
        copy(path, './results')
        console.log("✅ Copied successfully")
    } catch (err) {
        console.error('❌ Copy operation failed:', err);
    }

    try {
        await git.add('.');
        await git.commit(`Auto commit: ${new Date().toISOString()}`);
        await git.push('origin', 'main');
        console.log('✅ Pushed successfully');
    } catch (err) {
        console.error('❌ Git operation failed:', err);
    }
});