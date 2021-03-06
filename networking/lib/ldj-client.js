/** ldj-client.js
* @author Edgar Figueroa González - Grado en Ingeniería Informática ULL
*/

'use strict';
const EventEmitter = require('events').EventEmitter;
class LDJClient extends EventEmitter {
  constructor(stream){
    if (stream === null)
      throw new Error('Stream is null');
    super();
    let buffer = '';
    stream.on('data', data => {
      buffer += data;
      let boundary = buffer.indexOf('\n');
      while(boundary !== -1){
        const input = buffer.substring(0, boundary);
        buffer = buffer.substring(boundary + 1);
        this.emit('message', JSON.parse(input));
        boundary = buffer.indexOf('\n');
      }
    });

  stream.on('close', () => {
      let boundary = buffer.indexOf('}');
      if(boundary !== -1){
        const input = buffer.substring(0, boundary+1);
         try {
            this.emit('message', JSON.parse(input));
         } catch (e) {
            throw new Error('Non JSON message');
         }
      } else {
          buffer = '';
      }
          this.emit('close');
  });
}

  static connect(stream){
    return new LDJClient(stream);
  }
}

module.exports = LDJClient;
