/**
 * @class Tamil lip-sync processor
 * @author Based on English version by Mika Suominen
 */

class LipsyncTa {
  /**
   * @constructor
   */
  constructor() {
    // Tamil characters to Oculus visemes
    // Tamil is more phonetically consistent than English, so we can map directly
    this.rules = {
      // Tamil vowels (uyir)
      அ: [{ regex: /அ/, move: 1, visemes: ["aa"] }], // a
      ஆ: [{ regex: /ஆ/, move: 1, visemes: ["aa"] }], // aa
      இ: [{ regex: /இ/, move: 1, visemes: ["I"] }], // i
      ஈ: [{ regex: /ஈ/, move: 1, visemes: ["I"] }], // ii
      உ: [{ regex: /உ/, move: 1, visemes: ["U"] }], // u
      ஊ: [{ regex: /ஊ/, move: 1, visemes: ["U"] }], // uu
      எ: [{ regex: /எ/, move: 1, visemes: ["E"] }], // e
      ஏ: [{ regex: /ஏ/, move: 1, visemes: ["E"] }], // ee
      ஐ: [{ regex: /ஐ/, move: 1, visemes: ["aa", "I"] }], // ai
      ஒ: [{ regex: /ஒ/, move: 1, visemes: ["O"] }], // o
      ஓ: [{ regex: /ஓ/, move: 1, visemes: ["O"] }], // oo
      ஔ: [{ regex: /ஔ/, move: 1, visemes: ["aa", "U"] }], // au

      // Tamil consonants (mei)
      க்: [{ regex: /க்/, move: 1, visemes: ["kk"] }], // k
      ங்: [{ regex: /ங்/, move: 1, visemes: ["nn", "kk"] }], // ng
      ச்: [{ regex: /ச்/, move: 1, visemes: ["CH"] }], // ch
      ஞ்: [{ regex: /ஞ்/, move: 1, visemes: ["nn", "CH"] }], // nj
      ட்: [{ regex: /ட்/, move: 1, visemes: ["DD"] }], // t (retroflex)
      ண்: [{ regex: /ண்/, move: 1, visemes: ["nn"] }], // n (retroflex)
      த்: [{ regex: /த்/, move: 1, visemes: ["TH"] }], // th
      ந்: [{ regex: /ந்/, move: 1, visemes: ["nn"] }], // n
      ப்: [{ regex: /ப்/, move: 1, visemes: ["PP"] }], // p
      ம்: [{ regex: /ம்/, move: 1, visemes: ["PP"] }], // m
      ய்: [{ regex: /ய்/, move: 1, visemes: ["I"] }], // y
      ர்: [{ regex: /ர்/, move: 1, visemes: ["RR"] }], // r
      ல்: [{ regex: /ல்/, move: 1, visemes: ["nn"] }], // l
      வ்: [{ regex: /வ்/, move: 1, visemes: ["FF"] }], // v
      ழ்: [{ regex: /ழ்/, move: 1, visemes: ["nn"] }], // zh (unique Tamil sound)
      ள்: [{ regex: /ள்/, move: 1, visemes: ["nn"] }], // l (retroflex)
      ற்: [{ regex: /ற்/, move: 1, visemes: ["RR"] }], // r (hard)
      ன்: [{ regex: /ன்/, move: 1, visemes: ["nn"] }], // n (dental)
      ஜ்: [{ regex: /ஜ்/, move: 1, visemes: ["SS"] }], // j
      ஷ்: [{ regex: /ஷ்/, move: 1, visemes: ["SS"] }], // sh
      ஸ்: [{ regex: /ஸ்/, move: 1, visemes: ["SS"] }], // s
      ஹ்: [{ regex: /ஹ்/, move: 1, visemes: ["kk"] }], // h

      // Tamil compound characters (uyirmei) - mapping common ones
      // Format: consonant + vowel
      // We'll define a few examples for ka, ki, ku, etc. series

      // க series (ka, kaa, ki, kii, etc.)
      க: [{ regex: /க/, move: 1, visemes: ["kk", "aa"] }], // ka
      கா: [{ regex: /கா/, move: 1, visemes: ["kk", "aa"] }], // kaa
      கி: [{ regex: /கி/, move: 1, visemes: ["kk", "I"] }], // ki
      கீ: [{ regex: /கீ/, move: 1, visemes: ["kk", "I"] }], // kii
      கு: [{ regex: /கு/, move: 1, visemes: ["kk", "U"] }], // ku
      கூ: [{ regex: /கூ/, move: 1, visemes: ["kk", "U"] }], // kuu
      கெ: [{ regex: /கெ/, move: 1, visemes: ["kk", "E"] }], // ke
      கே: [{ regex: /கே/, move: 1, visemes: ["kk", "E"] }], // kee
      கை: [{ regex: /கை/, move: 1, visemes: ["kk", "aa", "I"] }], // kai
      கொ: [{ regex: /கொ/, move: 1, visemes: ["kk", "O"] }], // ko
      கோ: [{ regex: /கோ/, move: 1, visemes: ["kk", "O"] }], // koo
      கௌ: [{ regex: /கௌ/, move: 1, visemes: ["kk", "aa", "U"] }], // kau

      // ப series (pa, paa, pi, pii, etc.)
      ப: [{ regex: /ப/, move: 1, visemes: ["PP", "aa"] }], // pa
      பா: [{ regex: /பா/, move: 1, visemes: ["PP", "aa"] }], // paa
      பி: [{ regex: /பி/, move: 1, visemes: ["PP", "I"] }], // pi
      பீ: [{ regex: /பீ/, move: 1, visemes: ["PP", "I"] }], // pii
      பு: [{ regex: /பு/, move: 1, visemes: ["PP", "U"] }], // pu
      பூ: [{ regex: /பூ/, move: 1, visemes: ["PP", "U"] }], // puu
      பெ: [{ regex: /பெ/, move: 1, visemes: ["PP", "E"] }], // pe
      பே: [{ regex: /பே/, move: 1, visemes: ["PP", "E"] }], // pee
      பை: [{ regex: /பை/, move: 1, visemes: ["PP", "aa", "I"] }], // pai
      பொ: [{ regex: /பொ/, move: 1, visemes: ["PP", "O"] }], // po
      போ: [{ regex: /போ/, move: 1, visemes: ["PP", "O"] }], // poo
      பௌ: [{ regex: /பௌ/, move: 1, visemes: ["PP", "aa", "U"] }], // pau

      // த series (tha, thaa, thi, thii, etc.)
      த: [{ regex: /த/, move: 1, visemes: ["TH", "aa"] }], // tha
      தா: [{ regex: /தா/, move: 1, visemes: ["TH", "aa"] }], // thaa
      தி: [{ regex: /தி/, move: 1, visemes: ["TH", "I"] }], // thi
      தீ: [{ regex: /தீ/, move: 1, visemes: ["TH", "I"] }], // thii
      து: [{ regex: /து/, move: 1, visemes: ["TH", "U"] }], // thu
      தூ: [{ regex: /தூ/, move: 1, visemes: ["TH", "U"] }], // thuu
      தெ: [{ regex: /தெ/, move: 1, visemes: ["TH", "E"] }], // the
      தே: [{ regex: /தே/, move: 1, visemes: ["TH", "E"] }], // thee
      தை: [{ regex: /தை/, move: 1, visemes: ["TH", "aa", "I"] }], // thai
      தொ: [{ regex: /தொ/, move: 1, visemes: ["TH", "O"] }], // tho
      தோ: [{ regex: /தோ/, move: 1, visemes: ["TH", "O"] }], // thoo
      தௌ: [{ regex: /தௌ/, move: 1, visemes: ["TH", "aa", "U"] }], // thau

      // Add similar patterns for other consonants as needed
    };

    // Viseme durations in relative unit (1=average)
    // Adjusted for Tamil pronunciation
    this.visemeDurations = {
      aa: 1.0,
      E: 0.9,
      I: 0.85,
      O: 0.95,
      U: 0.9,
      PP: 1.1,
      SS: 1.2,
      TH: 1.05,
      DD: 1.1,
      FF: 1.0,
      kk: 1.2,
      nn: 0.9,
      RR: 0.8,
      CH: 1.1,
      sil: 1,
    };

    // Pauses in relative units (1=average)
    this.specialDurations = {
      " ": 1,
      ",": 3,
      "-": 0.5,
      "'": 0.5,
      ".": 4,
      "?": 3.5,
      "!": 3.5,
    };

    // Tamil number words
    this.digits = [
      "பூஜ்யம்",
      "ஒன்று",
      "இரண்டு",
      "மூன்று",
      "நான்கு",
      "ஐந்து",
      "ஆறு",
      "ஏழு",
      "எட்டு",
      "ஒன்பது",
    ];
    this.tens = [
      "",
      "பத்து",
      "இருபது",
      "முப்பது",
      "நாற்பது",
      "ஐம்பது",
      "அறுபது",
      "எழுபது",
      "எண்பது",
      "தொண்ணூறு",
    ];
    this.hundreds = [
      "",
      "நூறு",
      "இருநூறு",
      "முந்நூறு",
      "நானூறு",
      "ஐநூறு",
      "அறுநூறு",
      "எழுநூறு",
      "எண்ணூறு",
      "தொள்ளாயிரம்",
    ];
    this.thousands = "ஆயிரம்";
    this.lakhs = "லட்சம்";
    this.crores = "கோடி";

    // Symbols to Tamil
    this.symbols = {
      "%": "சதவீதம்",
      "€": "யூரோ",
      "&": "மற்றும்",
      "+": "கூட்டல்",
      $: "டாலர்",
      "₹": "ரூபாய்",
    };
    this.symbolsReg = /[%€&\+\$₹]/g;
  }

  /**
   * Convert number to Tamil words
   * @param {string} num Number as string
   * @return {string} Number in Tamil words
   */
  convertNumberToWords(num) {
    num = parseInt(num);

    if (num == 0) {
      return this.digits[0];
    }

    let words = "";

    // Handle crores (10 million)
    if (num >= 10000000) {
      words +=
        this.convertNumberToWords(Math.floor(num / 10000000)) +
        " " +
        this.crores +
        " ";
      num %= 10000000;
    }

    // Handle lakhs (100,000)
    if (num >= 100000) {
      words +=
        this.convertNumberToWords(Math.floor(num / 100000)) +
        " " +
        this.lakhs +
        " ";
      num %= 100000;
    }

    // Handle thousands
    if (num >= 1000) {
      words +=
        this.convertNumberToWords(Math.floor(num / 1000)) +
        " " +
        this.thousands +
        " ";
      num %= 1000;
    }

    // Handle hundreds
    if (num >= 100) {
      words += this.hundreds[Math.floor(num / 100)] + " ";
      num %= 100;
    }

    // Handle tens
    if (num >= 10 && num <= 19) {
      // Special case for 11-19 in Tamil
      words += this.digits[num % 10] + "பதின்" + " ";
    } else if (num >= 20) {
      words += this.tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    // Handle ones
    if (num > 0) {
      words += this.digits[num] + " ";
    }

    return words.trim();
  }

  /**
   * Preprocess text:
   * - convert symbols to words
   * - convert numbers to words
   * - filter out characters that should be left unspoken
   * @param {string} s Text
   * @return {string} Pre-processsed text.
   */
  preProcessText(s) {
    return s
      .replace(/[#_*\":;]/g, "")
      .replace(this.symbolsReg, (symbol) => {
        return " " + this.symbols[symbol] + " ";
      })
      .replace(/(\d)\.(\d)/g, "$1 புள்ளி $2") // Number separator (point)
      .replace(/\d+/g, this.convertNumberToWords.bind(this)) // Numbers to words
      .replace(/(\D)\1\1+/g, "$1$1") // max 2 repeating chars
      .replaceAll("  ", " ") // Only one repeating space
      .trim();
  }

  /**
   * Convert word to Oculus LipSync Visemes and durations
   * @param {string} w Text
   * @return {Object} Oculus LipSync Visemes and durations.
   */
  wordsToVisemes(w) {
    let o = { words: w, visemes: [], times: [], durations: [], i: 0 };
    let t = 0;

    const chars = [...o.words];
    while (o.i < chars.length) {
      const c = chars[o.i];
      const ruleset = this.rules[c];

      if (ruleset) {
        for (let i = 0; i < ruleset.length; i++) {
          const rule = ruleset[i];
          const test =
            o.words.substring(0, o.i) + c + o.words.substring(o.i + 1);
          let matches = test.match(rule.regex);

          if (matches) {
            rule.visemes.forEach((viseme) => {
              if (
                o.visemes.length &&
                o.visemes[o.visemes.length - 1] === viseme
              ) {
                const d = 0.7 * (this.visemeDurations[viseme] || 1);
                o.durations[o.durations.length - 1] += d;
                t += d;
              } else {
                const d = this.visemeDurations[viseme] || 1;
                o.visemes.push(viseme);
                o.times.push(t);
                o.durations.push(d);
                t += d;
              }
            });
            o.i += rule.move;
            break;
          }
        }
      } else {
        o.i++;
        t += this.specialDurations[c] || 0;
      }
    }

    return o;
  }

  /**
   * Process text to generate visemes
   * @param {string} text Input Tamil text
   * @return {Object} Processed visemes and timing data
   */
  processText(text) {
    const preprocessed = this.preProcessText(text);
    const words = preprocessed.split(" ");

    let result = {
      originalText: text,
      preprocessedText: preprocessed,
      words: [],
      visemes: [],
      times: [],
      durations: [],
    };

    let totalTime = 0;

    // Process each word
    for (let i = 0; i < words.length; i++) {
      if (words[i].trim() === "") continue;

      const wordResult = this.wordsToVisemes(words[i]);

      // Add the word data
      result.words.push({
        text: words[i],
        startTime: totalTime,
        visemes: wordResult.visemes,
        times: wordResult.times.map((t) => t + totalTime),
        durations: wordResult.durations,
      });

      // Add word's visemes to the global result
      for (let j = 0; j < wordResult.visemes.length; j++) {
        result.visemes.push(wordResult.visemes[j]);
        result.times.push(wordResult.times[j] + totalTime);
        result.durations.push(wordResult.durations[j]);
      }

      // Calculate word duration
      const wordDuration =
        wordResult.times.length > 0
          ? wordResult.times[wordResult.times.length - 1] +
            wordResult.durations[wordResult.durations.length - 1]
          : 0;

      totalTime += wordDuration + this.specialDurations[" "]; // Add word spacing
    }

    return result;
  }
}

export { LipsyncTa };
