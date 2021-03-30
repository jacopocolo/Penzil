//try using this instead: https://github.com/TrevorSundberg/h264-mp4-encoder

let video = class {
    constructor() {
        this.images = new Array()
        this.worker = new Worker('/ffmpeg-worker-mp4.js')
        this.message = 'Recording started'
        this.count = 0
    }
    pad(n, insetWidth, z) {
        z = z || "0";
        n = n + "";
        return n.length >= insetWidth ? n : new Array(insetWidth - n.length + 1).join(z) + n;
    }
    convertDataURIToBinary(dataUri) {
        var base64 = dataUri.replace(/^data[^,]+,/, "");
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));
        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
    addFrame(renderer) {
        // const img = new Image(),
        const mimeType = "image/jpeg";
        const imgString = renderer.domElement.toDataURL(mimeType, 1);
        const data = this.convertDataURIToBinary(imgString);
        this.images.push({
            name: `img${this.pad(this.images.length, 3)}.jpg`,
            data
        });
        this.message = 'Adding frame ' + this.count
        this.count++;
    }
    encode(update, callback) {
        this.worker.onmessage = function (e) {
            var msg = e.data;
            switch (msg.type) {
                case "stdout":
                case "stderr":
                    this.message += msg.data + "\n";
                    update(this.message)
                    break;
                case "exit":
                    this.message = "Process exited with code " + msg.data;
                    update(this.message)
                    //worker.terminate();
                    break;
                case "done":
                    callback(new Blob([msg.data.MEMFS[0].data], {
                        type: "video/mp4"
                    }));
            }
        };
        this.worker.postMessage({
            type: "run",
            TOTAL_MEMORY: 468435456,
            arguments: [
                "-r",
                "30",
                "-i",
                "img%03d.jpg",
                "-preset",
                "ultrafast",
                "-c:v",
                "libx264",
                "-crf",
                "1",
                "-vf",
                "scale=" + 1024 + ":" + 1024 + "",
                "-pix_fmt",
                "yuv420p",
                "-vb",
                "20M",
                "out.mp4"
            ],
            MEMFS: this.images
        });
    }
}

export { video }