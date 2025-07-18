import chokidar from 'chokidar';
import simpleGit from 'simple-git';
import fs from 'fs';
import { join, dirname, sep } from 'path';
import { mkdirSync, copyFileSync } from 'fs';

const git = simpleGit();

const detectFolder = 'C:/Users/sihan/OneDrive/문서/마음렌즈/Maumlenz/database/vision';

const watcher = chokidar.watch(detectFolder, {
    ignored: ['.git/**', 'node_modules/**'],
    ignoreInitial: true
});

watcher.on('change', async (path) => {
    if(path.endsWith('.xlsm')) {
        console.log(path.split(sep).pop());

        try {
            const destPath = join(process.cwd(), 'results', path.split(sep).pop());
            
            const destDir = join(process.cwd(), 'results');
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            fs.copyFileSync(path, destPath);
            console.log(`✅ Copied successfully to: ${destPath}`);

            try {
                await git.pull('origin', 'main');
                await git.add('.');
                await git.commit(`Auto commit: ${new Date().toISOString()}`);
                await git.push('origin', 'main');
                console.log('✅ Pushed successfully');
            } catch (err) {
                console.error('❌ Git operation failed:', err);
            }
        } catch (err) {
            console.error('❌ Copy operation failed!:', err);
        }
    }
});