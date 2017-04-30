let assert = require('assert')
let fs = require('fs')

class TextAnalyzer {
    constructor (filePath) {
        assert(typeof filePath == 'string')

        this.irrelevantWords = ['we', 'is', 'this', 'who', 'can', 'no', 'there', 'to', 'where', 'what']

        this.fileData = fs.readFileSync(filePath).toString()
        for (var i = 0; i < this.irrelevantWords.length; ++i) {
            let irrelevantWord = this.irrelevantWords[i]

            while(this.fileData.includes(' ' + irrelevantWord  + ' ')) {
                this.fileData = this.fileData.replace(' ' + irrelevantWord + ' ', ' ')
            }
        }

        this.words = this.fileData.replace(/\r/gi, '').split('\n').join(' ').split(' ')
    }

    getMostFrequent (word_c) {
        let modes = []

        for (let i = 0; i < word_c; ++i) {
            let mode = this.getMaxWord(this.words)
            modes.push(mode)
            this.removeWord(mode)
        }

        return modes
    }

    getMaxWord (words) {
        let wordOccurences = []

        wordOccurences.push({
            word: this.words[0],
            occurences: 1
        })

        for (let i = 1; i < words.length; ++i) {
            let word = this.words[i]

            for (let j = 0; j < wordOccurences.length; ++j) {
                let wordOccurence = wordOccurences[j]
                let last = (wordOccurences.length - 1) == j

                if (wordOccurence.word == word) {
                    ++wordOccurence.occurences

                    break;
                }

                if (last) {
                    wordOccurences.push({
                        word: word,
                        occurences: 1
                    })
                }
            }
        }

        if (!wordOccurences.length) {
            return
        }

        let maxW = wordOccurences[0].word
        let maxOcc = wordOccurences[0].occurences
        for (let i = 1; i < wordOccurences.length; ++i) {
            let wordOccurence = wordOccurences[i]

            if (wordOccurence.occurences > maxOcc) {
                maxOcc = wordOccurence.occurences
                maxW = wordOccurence.word
            }
        }

        return maxW
    }

    removeWord (wordR) {
        let words = []

        this.words.forEach((word) => {
            if (word != wordR) {
                words.push(word)
            }
        })

        this.words = words
    }
}

let main = () => {
    let textAnalyzer = new TextAnalyzer('../data/texts.txt')

    let modes = textAnalyzer.getMostFrequent(10)

    modes.forEach((mode) => {
        console.log(mode)
    })
}

if (typeof require.main != 'undefined') {
    main()
}
