import chokidar from 'chokidar';
import simpleGit from 'simple-git';

const git = simpleGit();

const detectFolder = `/Users/seonghyeoning/Documents/감시당하는 폴더`

const watcher = chokidar.watch(detectFolder, {
    ignored: ['.git/**', 'node_modules/**'],
    ignoreInitial: true
});

watcher.on('addDir', async (event, path) => {
    console.log(`Detected ${event} on ${path}, running git commands…`);
    try {
        await git.add('.');
        await git.commit(`Auto commit: ${new Date().toISOString()}`);
        await git.push('origin', 'main');
        console.log('✅ Pushed successfully');
    } catch (err) {
        console.error('❌ Git operation failed:', err);
    }
});