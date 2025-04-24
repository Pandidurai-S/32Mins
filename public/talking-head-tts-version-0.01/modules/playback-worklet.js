class PlaybackProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = null;
    this.playbackTime = 0;
    this.isPlaying = false;
    
    this.port.onmessage = (event) => {
      if (event.data.type === 'buffer') {
        this.buffer = event.data.buffer;
      } else if (event.data.type === 'play') {
        this.isPlaying = true;
        this.playbackTime = 0;
      } else if (event.data.type === 'stop') {
        this.isPlaying = false;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0];
    
    if (!this.isPlaying || !this.buffer) {
      return true;
    }

    for (let channel = 0; channel < output.length; ++channel) {
      const outputChannel = output[channel];
      const bufferChannel = this.buffer[channel];
      
      for (let i = 0; i < outputChannel.length; ++i) {
        if (this.playbackTime < bufferChannel.length) {
          outputChannel[i] = bufferChannel[this.playbackTime];
        } else {
          outputChannel[i] = 0;
        }
        this.playbackTime++;
      }
    }

    if (this.playbackTime >= this.buffer[0].length) {
      this.isPlaying = false;
      this.port.postMessage({ type: 'ended' });
    }

    return true;
  }
}

registerProcessor('playback-processor', PlaybackProcessor); 