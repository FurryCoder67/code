class ElevatorCanvas {
    constructor(canvas) {
        this.canvas   = canvas;
        this.ctx      = canvas.getContext('2d');
        this.timer    = 0;
        this.domStats = null;
        this.C = {
            bg:       '#12131a',
            amber:    '#ffb000',
            amberDim: '#b37a00',
            amberGl:  'rgba(255,176,0,0.3)',
            cyan:     '#00ffd0',
            cyanGl:   'rgba(0,255,208,0.3)',
            red:      '#ff3366',
            redGl:    'rgba(255,51,102,0.3)',
            grid:     'rgba(255,176,0,0.06)',
            dim:      'rgba(255,255,255,0.35)',
            shaft:    '#0d0e12',
            dark:     '#0a0a0c'
        };
    }

    render(building) {
        this.timer++;
        const { ctx, canvas, C } = this;
        const nF  = building.floors.length;
        const nE  = building.elevators.length;
        const PAD = 25, SW = 140, SG = 8;
        const FH  = canvas.height / nF;
        const TSW = SW * nE + SG * (nE - 1) + 60;
        const SX0 = canvas.width - TSW - PAD + 30;

        // DOM stats
        if (this.domStats) {
            let w = 0, t = 0;
            building.floors.forEach(f    => w += f.queue.people.length);
            building.elevators.forEach(e => t += e.queue.people.length);
            this.domStats.timer.textContent   = String(this.timer).padStart(3, '0');
            this.domStats.waiting.textContent = w;
            this.domStats.transit.textContent = t;
        }

        // Clear
        ctx.fillStyle = C.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width;  x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
        for (let y = 0; y < canvas.height; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);   ctx.stroke(); }

        // Building outline
        ctx.strokeStyle = C.amberDim; ctx.lineWidth = 2;
        ctx.strokeRect(PAD, 0, canvas.width - PAD * 2, canvas.height);

        // Floors
        for (let f = 0; f < nF; f++) {
            const fy    = canvas.height - (f + 1) * FH;
            const floor = building.floors[f];

            // Separator
            ctx.strokeStyle = C.amberDim; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(PAD, fy + FH); ctx.lineTo(canvas.width - PAD, fy + FH); ctx.stroke();

            // Floor label
            ctx.fillStyle = C.amber; ctx.font = '900 28px Orbitron,monospace'; ctx.textAlign = 'left';
            ctx.fillText(f, PAD + 15, fy + FH - 20);
            ctx.fillStyle = C.dim; ctx.font = '300 9px JetBrains Mono,monospace';
            ctx.fillText('LEVEL', PAD + 15, fy + FH - 45);

            // Button panel
            const bx = PAD + 60, by = fy + FH / 2 - 25;
            ctx.fillStyle = 'rgba(255,176,0,0.05)'; ctx.fillRect(bx, by, 32, 50);
            ctx.strokeStyle = 'rgba(255,176,0,0.2)'; ctx.lineWidth = 1; ctx.strokeRect(bx, by, 32, 50);

            if (f < nF - 1) {
                ctx.fillStyle = floor.upButtonPressed ? C.cyan : 'rgba(0,255,208,0.15)';
                if (floor.upButtonPressed) { ctx.shadowColor = C.cyan; ctx.shadowBlur = 15; }
                ctx.beginPath(); ctx.moveTo(bx+16,by+8); ctx.lineTo(bx+26,by+20); ctx.lineTo(bx+6,by+20); ctx.closePath(); ctx.fill();
                ctx.shadowBlur = 0;
            }
            if (f > 0) {
                ctx.fillStyle = floor.downButtonPressed ? C.red : 'rgba(255,51,102,0.15)';
                if (floor.downButtonPressed) { ctx.shadowColor = C.red; ctx.shadowBlur = 15; }
                ctx.beginPath(); ctx.moveTo(bx+16,by+42); ctx.lineTo(bx+26,by+30); ctx.lineTo(bx+6,by+30); ctx.closePath(); ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Waiting people
            const wx  = PAD + 110, sp = 38;
            const mpr = Math.max(1, Math.floor((SX0 - wx - 20) / sp));
            floor.queue.people.forEach((p, i) => {
                this.drawPerson(wx + (i % mpr) * sp, fy + 30 + Math.floor(i / mpr) * 50, p.destinationFloor, p.destinationFloor > f);
            });
        }

        // Elevator shafts
        for (let i = 0; i < nE; i++) {
            const e  = building.elevators[i];
            const sx = SX0 + i * (SW + SG);

            ctx.fillStyle = C.shaft; ctx.fillRect(sx, 0, SW, canvas.height);
            ctx.strokeStyle = 'rgba(255,176,0,0.3)'; ctx.lineWidth = 2; ctx.strokeRect(sx, 0, SW, canvas.height);

            ctx.fillStyle = C.dim; ctx.font = '500 10px JetBrains Mono,monospace'; ctx.textAlign = 'center';
            ctx.fillText(`SHAFT ${String.fromCharCode(65 + i)}`, sx + SW / 2, 15);

            // Rails
            ctx.strokeStyle = 'rgba(255,176,0,0.1)'; ctx.lineWidth = 3;
            [sx + 8, sx + SW - 8].forEach(rx => { ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx, canvas.height); ctx.stroke(); });

            // Floor indicators
            for (let f = 0; f < nF; f++) {
                const iy = canvas.height - (f + 1) * FH + FH - 5;
                ctx.fillStyle = e.currentFloor === f ? C.amber : 'rgba(255,176,0,0.15)';
                ctx.font = '700 11px Orbitron,monospace'; ctx.textAlign = 'center';
                ctx.fillText(f, sx + SW / 2, iy);
            }

            // Car geometry
            const cy = canvas.height - (e.currentFloor + 1) * FH + 8;
            const ch = FH - 16, cx = sx + 12, cw = SW - 24, mid = cx + cw / 2;
            const gU  = e.destinationFloor > e.currentFloor;
            const gD  = e.destinationFloor < e.currentFloor;
            const sc  = gU ? C.cyan  : gD ? C.red  : C.amberDim;
            const sgl = gU ? C.cyanGl : gD ? C.redGl : C.amberGl;

            // Shadow + body
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(cx+4, cy+4, cw, ch);
            ctx.fillStyle = '#1a1b22';          ctx.fillRect(cx,   cy,   cw, ch);

            // Border glow
            ctx.strokeStyle = sc; ctx.lineWidth = 2; ctx.shadowColor = sgl; ctx.shadowBlur = 10;
            ctx.strokeRect(cx, cy, cw, ch); ctx.shadowBlur = 0;

            // Doors
            const dw = (cw - 4) / 2 - 8;
            ctx.fillStyle = '#252730';
            ctx.fillRect(cx+4,       cy+25, dw, ch-35);
            ctx.fillRect(cx+cw-dw-4, cy+25, dw, ch-35);
            ctx.strokeStyle = 'rgba(255,176,0,0.2)'; ctx.lineWidth = 1;
            ctx.strokeRect(cx+4,       cy+25, dw, ch-35);
            ctx.strokeRect(cx+cw-dw-4, cy+25, dw, ch-35);

            // Floor display
            ctx.fillStyle = C.dark; ctx.fillRect(mid-20, cy+4, 40, 18);
            ctx.strokeStyle = sc;   ctx.strokeRect(mid-20, cy+4, 40, 18);
            ctx.fillStyle = sc; ctx.font = '700 12px Orbitron,monospace'; ctx.textAlign = 'center';
            ctx.fillText(e.currentFloor, mid, cy+17);
            if (gU || gD) { ctx.font = '14px Arial'; ctx.fillText(gU ? '▲' : '▼', mid+25, cy+16); }

            // People inside
            e.queue.people.forEach((p, idx) => {
                this.drawPerson(cx+25+(idx%2)*45, cy+45+Math.floor(idx/2)*45, p.destinationFloor, p.destinationFloor > e.currentFloor, true);
            });

            // Capacity label
            ctx.fillStyle = C.dim; ctx.font = '300 8px JetBrains Mono,monospace'; ctx.textAlign = 'center';
            ctx.fillText(`${e.queue.people.length}/${e.capacity}`, mid, cy+ch-5);
        }

        // Corner brackets
        [ [PAD-5, -5, false, false], [canvas.width-PAD+5, -5, true, false],
          [PAD-5, canvas.height+5, false, true], [canvas.width-PAD+5, canvas.height+5, true, true]
        ].forEach(([x, y, fx, fy]) => this.bracket(x, y, 20, C.amber, fx, fy));
    }

    drawPerson(x, y, dest, goingUp, small = false) {
        const { ctx, C } = this;
        const col = goingUp ? C.cyan  : C.red;
        const gl  = goingUp ? C.cyanGl : C.redGl;
        const s   = small ? 14 : 16;
        ctx.shadowColor = gl; ctx.shadowBlur = 8; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(x, y - s * .6, s * .35, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(x - s*.4, y); ctx.lineTo(x + s*.4, y);
        ctx.lineTo(x + s*.25, y + s*.7); ctx.lineTo(x - s*.25, y + s*.7);
        ctx.closePath(); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = C.dark; ctx.beginPath(); ctx.arc(x, y + s*.2, s*.35, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = col; ctx.font = `700 ${s * .45}px Orbitron,monospace`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(dest, x, y + s * .25);
        ctx.textBaseline = 'alphabetic';
    }

    bracket(x, y, size, color, flipX, flipY) {
        const { ctx } = this;
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + size * (flipX ? -1 : 1), y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + size * (flipY ? -1 : 1));
        ctx.stroke();
    }
}
