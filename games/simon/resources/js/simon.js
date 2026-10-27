const SIMON_SOUNDS = {0:"data:audio/mpeg;base64,//NAwAAAAAJYAUAAAP/c0Zhhsa0QV/vxJjdg1ja5Kv+X4GSASN53w1cCAGBlQP4hOJTGT/w1YHVCxcDfkf/AMBDBIORcr//5OFw0N9P//8oGgARgXKMmhr////06CDJ+9X////+z7aD/80DAWxjzEjgBnaABgaByYceMwT48EjRUAUCVl5AgOzAozDFMnD/HZTggdzDcGjAsKhIDWgKAs4q44U2Wq1q0IgNMDgCZc/Wf//RcY4BwwX25dRR//////vSD8g4Fkv/////////////zQMBSFmLmilHdmAH//WeDoxPw4CSmAgMA5dQGh+Y3VqZohyXUS/fdnCsbz87z/2SEAAqN//+iah3Aik///////eiLwiqv/////////////+ibBJgFgiIweZiIAC4wZBkw5Co3IjY3//NAwFMQ8uqMAutiudQwKBdQPZCsoUAl0ct9//CFAWlv//0SqErGeR//////95wPwDNpf/////////////9AujlAfAk4sIk2MwIQBjBDAFMAIHowsUejDOB+AIDpZRAYmuhozS1zWv3/80DAahHi7oAA7Ka42BpB2UP//qlUNTEkPf/////+qcGGFDJt//////////////qNhCoLqQBtW/MEBVCAKMTAbOF2nOVgXIiaDAMQCJtjoINix1jr1LUsEMRqX//7w6EN9b//////rf/zQMB9EprmgAD0JriqEYifl//////////////6lk0H6AH4HaAAUjgBlKwQUAXMAAB4cCLMJBSMwNQjzAKAiLVsrSYSDaHRf//0RJAjv/19/c6pJ//U3R6r///s5wRiZN////////////NAwI0SWup8AOwmuP///9RKiuAZ+SR4AFAwAd5ahCEhhQAgQXR0kEh4GA5EYgOCdDmOAEOg2p3ljhr/HUDL/7d/Ws+Sb/+rX/f//9lGRDw3hv/////////////+mKeLkAwyQhTwAED/80DAnhNy7nx482S4mkFABTApAYMBYDcwDwkjB3WaMRUJQwBQHxQAJIBLIt61af/PXveOgKyv9ktX81G////////WUxPv//////////////XIwByAF4kUWyABRCxiiMN3ABSGSZak9P/zQMCrE2rudHjsaLjpD8DZc8akMNsgi1vX9/oJAJvoz88kNMdzOaQiMMl/9jD3MZlmK6v6vV1J3IIZpf///7VMnVr9WtV///////mQjIC8bsAHBQrwwUt0YgTmeYRjTadrdnXbIJAm//NAwLgTmu50YPQmuaTSHVLRQq/jjauzUOFwAhdrJXVnub6FQVGL/+/95n//7qJgy0m/X/7f3U7da1an1vs3//////rNSQAPTFiAAJUiMLDjIPDQsw0VwJ9zJqMDA0kCzJL8aDisFqj/80DAxBSa7os+2qC68+apKRIeCtoN6v/0yVDVYXTKzf/////9riti+v////qXs1mW9/Uv//////7nwQ4QXGmsAygAQpAaZS7HQyxr4gYkgmqI4sWMHaqzkAA6ENN++fuUAmEMa39nVf/zQMDMFLLubzbZ2riqcej0QQBYTjTv/////+xNJU4fb///9FT9XRRRU/qSUl//////0x6g3gAKgskQXKzxl7QGpKWlygYcRqFVDpy5iKafDF2ovNDoiigmQPMVFUx2RUVEV2JDURgh//NAwNQUMu5YBuSiuBAIBHGhMs7P/////5UVU////////////+iqzs5QwUECOR9ChgQYsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/80DA3hVi7kxG2pq4AAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIP/zQMDjFOr5yADBxLkAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA//NAwOoAAAJYAAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAAC/A+kEAAAz",1:"data:audio/mpeg;base64,//MwwAAAAAJYAUAAAAwBQGBwOBQOBgB1A34DtDQYPAAoDTjIGnfIxb/j8RYt/4LgFg/M/8eMePz//8kMZzScKb//8RC//////bf3//////MwwEERwvZ8f5NQIP/zIDAmFykJFSHUAMBQMPhYIwQDnwaBwUBvEMsUBopNvzoyJEkv//MimHh0v/////0jApt////////////+okBQ//MwwDsOqpKlgdVoAYAOxQvEsGIPI1ZBTAfuMUlfC/3//6hNEP//zEVv/////+TCP/////////////WEEaiJVUBKRpg16HGSKXagm5jl//MwwEEMKpahQNtatI0/f//xV///WYi1//////1CiE/////////////74MDUwBX6RJRJgw+LgHax4NNRl9e5dr///9Qcf//6Hib///////MwwFEMIpqcAONUtP6DATv////////////vhOBW4AIzdgZA6CQwetzs44CAOziH6ekt0vP//oGbf//Q8l//////0iYQv/////////////MwwGEMWpqcIOKUtP+gfBnPgCBZsQDUjhqh/AaqMIjIP1JozTZ2b6BeP/+06jkwdO+3dlnf1n0//QN/////////////zlAEAAkpdIEA//MwwHANCpqcQOKatDLpGHnCeqHAYIV/XqlWtU5+v/C03//4zDr//////6ZLf///////////+rRL4Ns1A4l4dABeRlxhoPH7CeGBRk7u//MwwHwNQpaoeKqOtlJK6SVf+//BT//+gxH3//////MT3////////////2WZm4CQHABXvBlFILmwupABOACQwcKJGzov+gt/+1LOECCv//MwwIgNQpqUYOKatOxyKjdTTpV2NX/6Dw7///6/////////8aALgC5EKgERyqWRCITaCNHAManK+8quP///Ug8XW62+68KDpX//66f///MwwJQNepaQSOKatf5hRP////////////8LDjgAj04wIGBJwLAzPRwgeFvpxQE3F0985//xCMIhl//9CUVyb//////OJ///be/1fr////MwwJ8NypqoeKFKtv////7BJS6eQAhH1JQjhyB5xsbno2pY98tmpdll/758qD0Wp//6AuB0//////8SDor/////oYrf//////4RAEcA//MwwKgNapqYeslKti+pBD0YljhHqDhC1BtCLjcLGgEsssz0KEOztZ6p2/ymKFQ5Hb/////////////////ZymKCBgwNUAAAAAAAAAAA//MwwLMOQpp0GNqatAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA//MwwLsOCppwOMnKtiAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAg//MwwMMOIo3UAHiEtQAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA//MwwMsAAAJYAAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAAvwMdBQAANA==",2:"data:audio/mpeg;base64,/+MwwAAAAAJYAUAAAP+tETMpXTjE8/9p6ozVZHD2+Jf9rlcyxCASEjmi3Ayg4DJFABknvwN8gAejA04cLZ/+RMvjrFBi4/++CACAkwBujArQiBc//yuYE4XybK6P//6aZOIIINAcC////BtqBkwJ4wNOggg/////+m9lug3///////0000PoGBOAZMKHtBaYbpgkyGBRct8YHD2Y/+MgwI8hLBIwAZ2gAJQNmIoVGDY0n8pKHbhMmGpIGIg1RNIpgJCABftjsSs46prWX41UisI7CZcNUDnEWJ5Kk+i3/r1sZE8AuAA0KELMkSKyv////////UkkQcGosR0RySLL////////4zDAZR8T6nTJ3aAB///////////+tygQ8OKAywgOXE7mB4HAlMtlYEAYeAQLAMYAj+Z1emZPjKYHhGYRgKTApA8ItYY8/+e/rTMQHY42////qMCbFYKKaP////////9MtJAOei///////////////////6TsViaByQBoJSAAURzJnJgMBo6Bpg0DJh6Ixxh5RtuGxgaN5hsLoCD/4yDAdxYr4oQA7BrZORRadDsuq9y7z0eqiPyAHJT////3MTxocS///q/v////1nRIhtJJf//////////////////ouWSVGsGCgJkZY1TgfhHcFAUYQgiKgih8YgBocZ8Ia+FgYPhMYP/jMMB5F9vmeBjrYtnIfAoA1AKksjFjuev8wshrJMEsCbPt////UYDSaP/////////uiXBZSX//////////////////9SiiXgxuA8hBgcz55wPUoDWWggwOg0HGVxCIwUYpHZwxSmZDeadOgYJlUHAkUrn4/S1q9NfTNZY0BgQQn6f///PIC5////aum3///85iBh8L2X//+j1nsv/jIMCoF0PueADrYtinfamuh6q9tKHtZm7OtEp///////VkUSwCoiBkTKgOASAt0NAzfdztASEmZI+d7eZxkbhyCoMPvo06WKbRGlyy/E3Q41AFAeCATHV///9B4JgAQJEW/////////+MwwKYaK+Z4FuKU2/8ydL///+ip/+v99SanRSRfZF6KTotuiyn///////1ssujSEhMDYDDjAITEZgRnTFFgNHNkJNi0MZJBLEDUAU6LIs8ZsuV4IHt3K9g2RakXiRJhfLCWLpxN2qsp12/2SJpIEMYELsFaJuMgeRd7f///////NRWJGop7f/////////////////5qKxxglAtE/+MgwMwY4+ZkBtHa2gNxgkaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIAAgACAAIAAgACAAIAAgACD/4zDAwxsL7hQA007YACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAD/4yDA5QAAAlgAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAAL8DGQQAADU=",3:"data:audio/mpeg;base64,/+MgwAAAAAJYAUAAAP/dwzLGc0Onr/lmztZgjZRFv+/YIjZAQV9DAwBgDXLgCmn+PwoAcAav/ZsM8AYEAdJMGERR//xwMxcLhp//m7s5ZGbES///AOAFF0Gqp////pvTdDoM//////T/4yDAWxo7GjgBnaAA3pm4WiCdQ5c0DH///ygYdCS8D0CgCgZy5L0xOCoxzDg47YA6GA8wVB0wEASN1oMimvx7rHHKVKTEICyHl//+uZF8P+MMAWxiX//////6RKitjxdb///////////jIMBNFgrqsv/dkAH///+vQTEdjJiUBIBpNkWAtJcKBmYw1CYvCKlJE3PfJtpfe7+vpToxQJ4tv//6zAkQVRb//////9BAkg4Si3/////////////+oeoK6NxBPOB26zTR0NGIyGd0/+MgwE8RGvKQAOtauPefLGZkQCCQDhlTARgWmqY7z+SSERYIS3+v/mmnFm//////95kVEoUm//////////////0B8BbAAQwWlDyozUCh4GCoYSFYZkdYcMgwKAGIgALuq6L2q9y7n/r/4yDAZRHC6oQA4pq5lqcHsJQ0W31/r9RMMf//////8lBklt/////////////9VIvkCApAbCGAisCAAwHDMETjLywxZNMTlDiXwxFYMhLx4IR0LjtWcbOW0vLTIcRC8BUs1P6/2IjBaP/jIMB5EprufADrZLnG///7fN67fx41v////+3+nb//////oeAkDRLJiwDgANKaqYWwHLwBpK4c/QGxlxkIU2GPu458h3zLfLxMExguZ///OEYFAnCU3//////0Hppv////U039zWdt/+MgwIkS0u53JtqOuFL2//////6D4QQAoXkoj7QFRF0TCAENIXBc4IAmIt9yZyHrtnWRQ8iNio4exyOaj9bamEgegSCwPxgbDpj//////1VjKj/////////////9WMGOMBBQQsY2QAD/4yDAmBKq7mQG2dS4AAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIP/jIMCoEtr2HADBxLkAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA/+MgwLcAAAJYAAAAACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgAAC/AzEKAAA2"};
/**
 * 2021 - Sergio Soriano
 * https://github.com/sergiss
 * www.sergiosoriano.com
 */
const LIGHT_TIME = 200;
const STEP_TIME = LIGHT_TIME * 2.0;

class Simon {
  constructor(elements, score) {
    this.elements = elements;
    this.score = score;
    this.buttons = [];
    for (let i = 0; i < 4; ++i) {
      this.buttons[i] = this.createButton(i, elements[i]);
    }

    this.restart();   
  }

  animate(i) {
    if(!i) {this.gameState = -1; i = 0;}
    if (this.gameState == -1) {
      let el = this.elements[i];
      setTimeout(() => {
        // el.style.filter = "brightness(250%)"; // apply brightness
        el.style.fillOpacity = "1";
        setTimeout(() => {
          // wait to clear brightness
          // el.style.filter = "brightness(100%)";
          el.style.fillOpacity = "0.5";
          this.animate((i + 1) % 4);
        }, LIGHT_TIME);
      }, 5);
    }
  }

  restart = function () {
    this.gameState = 0;
    this.sequence = [];
    this.cpuIndex = -1;
    this.playerIndex = -1;
    this.score.innerHTML = 0;
  };

  step = function () {
    if (this.playerIndex === this.cpuIndex || this.cpuIndex === -1) {
      this.score.innerHTML = Math.max(
        this.score.innerHTML,
        this.playerIndex + 1
      );
      this.gameState = 0; // cpu's turn
      this.playerIndex = 0;
      setTimeout(() => {
        // little pause
        this.playSequence(0, () => {
          // plays the stored sequence
          // finally add one more step to the sequence
          this.cpuIndex++; // increment cpu cpuIndex
          let id = Math.floor(Math.random() * 4); // rnd id
          this.sequence.push(id); // add id to sequence
          this.buttons[id](false); // perform
          this.gameState = 1; // player's turn
        });
      }, STEP_TIME);
    } else {
      this.playerIndex++; // increment user cpuIndex
    }
  };

  playSequence = function (i, callback) {
    setTimeout(() => {
      if (this.cpuIndex >= i) {
        this.buttons[this.sequence[i]](false);
        this.playSequence(i + 1, callback); // next step
      } else {
        callback(); // end
      }
    }, STEP_TIME);
  };

  createButton = function (id, el) {
    const sound = new Sound(SIMON_SOUNDS[id]);
    el.style.fillOpacity = "0.5";
    const result = (player) => {
      // el.style.filter = "brightness(250%)"; // apply brightness
      el.style.fillOpacity = "1";
      sound.stop();
      sound.play(0.05);
      setTimeout(() => {
        // wait to clear brightness
        // el.style.filter = "brightness(100%)";
        el.style.fillOpacity = "0.5";
      }, LIGHT_TIME);
      if (player) {
        // if player time
        if (this.sequence[this.playerIndex] === id) {
          // check
          this.step();
        } else {
          console.log("game over");
          this.restart();   
          this.animate();
        }
      }
    };

    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      if (this.gameState === 1) {
        // if player's turn
        result(true); // perform click
      } else if(this.gameState === -1) {
        this.restart();   
        this.step();
      }
    });

    return result;
  };
}
