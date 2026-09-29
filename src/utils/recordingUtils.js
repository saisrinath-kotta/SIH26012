/**
 * Screen capture and 3D WebGL Canvas Video Recorder
 * Uses HTMLCanvasElement.captureStream() and MediaRecorder API
 */

export class CanvasVideoRecorder {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.startTime = null;
    this.stream = null;
  }

  startRecording(fps = 30) {
    if (!this.canvas) {
      throw new Error('No canvas element available to record.');
    }

    try {
      this.recordedChunks = [];
      this.stream = this.canvas.captureStream(fps);

      // Support vp9 / vp8 or fallback to standard webm
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        videoBitsPerSecond: 8000000 // 8 Mbps high quality
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(200); // 200ms time slice chunks
      this.isRecording = true;
      this.startTime = Date.now();
      return true;
    } catch (err) {
      console.error('Failed to start canvas video recording:', err);
      throw err;
    }
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        return reject(new Error('Recorder is not active.'));
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        this.isRecording = false;
        
        // Stop stream tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        resolve({
          blob,
          url: videoUrl,
          duration: Date.now() - (this.startTime || Date.now())
        });
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Helper to trigger automatic file download
   */
  static downloadRecording(videoUrl, filename = 'cadastral_3d_flight.webm') {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Capture a pristine high-resolution snapshot from WebGL Canvas
   */
  static captureSnapshot(canvasElement, filename = 'cadastral_snapshot.png') {
    if (!canvasElement) return null;
    try {
      const dataUrl = canvasElement.toDataURL('image/png', 1.0);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return dataUrl;
    } catch (err) {
      console.error('Failed to capture canvas screenshot:', err);
      return null;
    }
  }
}
