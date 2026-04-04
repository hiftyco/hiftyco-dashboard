const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('.'));

// Serve Bitcoin Education at /education
app.use('/education', express.static('../hiftyco-education'));

// Run script helper
function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        exec(`bash ${scriptPath}`, { cwd: '/data/.openclaw/workspace' }, (error, stdout, stderr) => {
            if (error) {
                reject({ error: error.message, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

// API: Run Daily Research
app.get('/api/research', async (req, res) => {
    try {
        const result = await runScript('/data/.openclaw/workspace/daily-research.sh');
        res.json({ success: true, output: result.stdout });
    } catch (e) {
        res.json({ success: false, error: e.error });
    }
});

// API: Run Morning Briefing
app.get('/api/briefing', async (req, res) => {
    try {
        const result = await runScript('/data/.openclaw/workspace/morning-briefing.sh');
        res.json({ success: true, output: result.stdout });
    } catch (e) {
        res.json({ success: false, error: e.error });
    }
});

// API: Run System Check
app.get('/api/system', async (req, res) => {
    try {
        const result = await runScript('/data/.openclaw/workspace/system-check-cron.js');
        res.json({ success: true, output: result.stdout });
    } catch (e) {
        res.json({ success: false, error: e.error });
    }
});

// API: Get Journal
app.get('/api/journal', (req, res) => {
    const journalPath = '/data/.openclaw/workspace/journal';
    try {
        const files = fs.readdirSync(journalPath).filter(f => f.endsWith('.md'));
        res.json({ success: true, files });
    } catch (e) {
        res.json({ success: false, files: [] });
    }
});

// API: Get latest research
app.get('/api/research/latest', (req, res) => {
    try {
        const files = fs.readdirSync('/data/.openclaw/workspace').filter(f => f.startsWith('daily-research'));
        if (files.length > 0) {
            const latest = files.sort().pop();
            const content = fs.readFileSync(`/data/.openclaw/workspace/${latest}`, 'utf8');
            res.json({ success: true, content, file: latest });
        } else {
            res.json({ success: false, error: 'No research found' });
        }
    } catch (e) {
        res.json({ success: false, error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Hifty Co Dashboard running on port ${PORT}`);
});
