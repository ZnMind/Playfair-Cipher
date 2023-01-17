import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [keyword, setKeyword] = useState("");
  const [phrase, setPhrase] = useState("");
  const [diPhrase, setDiPhrase] = useState("");
  const [length, setLength] = useState(0);
  const [encrypted, setEncrypted] = useState("");
  const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
  const [cipher, setCipher] = useState(alphabet);


  useEffect(() => {
    getDupes();
  }, [keyword]);

  const getDupes = () => {
    // This function sets the keyword at the start of the cipher and removes all duplicate letters
    var newAlphabet = alphabet;
    var newKey = keyword.toLowerCase().split('');

    if (keyword) {
      for (let i = 0; i < keyword.length; i++) {
        if (keyword[i] === 'j') {
          newKey[i] = 'i';
        }
        if (keyword[i] === keyword[i - 1]) {
          newKey[i] = 'x';
        }
      }
      for (let i = keyword.length - 1; i >= 0; i--) {
        if (keyword[i] !== " ") {
          newAlphabet.unshift(newKey[i]);
        }
      }
      
      newKey = newKey.join('').split(" ").join('').split('')
      setLength(newKey.filter((item, index) => newKey.indexOf(item) === index).length)
      const dupes = newAlphabet.filter((item, index) => newAlphabet.indexOf(item) === index)
      setCipher(dupes.slice(0, 25));
    }
  }

  const digraph = () => {
    // This function breaks the secret phrase into digraphs
    // If the digraph consists of the same letter the 2nd is replaced with x
    // Also if the phrase has an odd number of letters an x is appended to make it an even number
    var newStr = [];
    var noSpace = phrase.toLowerCase().split(" ").join('');
    var newPhrase = noSpace.split('');

    for (let i = 0; i < noSpace.length; i += 2) {
      if (i === noSpace.length - 1) {
        newStr.push(newPhrase[i] + 'x');
      } else {
        if (noSpace[i + 1] === noSpace[i]) {
          newStr.push(newPhrase[i] + 'x');
        } else {
          newStr.push(newPhrase[i] + newPhrase[i + 1]);
        }
      }
    }
    setDiPhrase(newStr.join(" ").toLowerCase())
    return newStr;
  }

  const getLocation = di => {
    // This function gets the index of each letter in the digraph and translates to new values
    var index1 = cipher.findIndex(el => el === di[0])
    var index2 = cipher.findIndex(el => el === di[1])
    var t1;

    if (index1 % 5 === index2 % 5) {
      // Same column
      if (index1 >= 20) {
        index1 -= 20;
      } else {
        index1 += 5;
      }
      if (index2 >= 20) {
        index2 -= 20;
      } else {
        index2 += 5;
      }
    } else if (Math.floor(index1 / 5) === Math.floor(index2 / 5)) {
      // Same row
      if (index1 % 5 === 4) {
        index1 -= 4;
      } else {
        index1 += 1;
      }
      if (index2 % 5 === 4) {
        index2 -= 4;
      } else {
        index2 += 1;
      }
    } else {
      // Rectangle
      t1 = index1 - (index1 % 5 - index2 % 5);
      index2 = index2 - (index2 % 5 - index1 % 5);
      index1 = t1;
    }
    return cipher[index1] + cipher[index2]
  }

  const encrypt = () => {
    const pairs = digraph();
    var pairsIndex = [];
    var fiveLong = [];

    if (phrase) {
      for (let i = 0; i < pairs.length; i++) {
        pairsIndex.push(getLocation(pairs[i]))
      }
      pairsIndex = pairsIndex.join('');

      for (let j = 0; j < pairsIndex.length; j++) {
        if (j > 0 && j % 5 === 0) {
          fiveLong.push(" " + pairsIndex[j]);
        } else {
          fiveLong.push(pairsIndex[j])
        }
      }
      setEncrypted(fiveLong.join(''))
    }
  }

  const handleKeyword = event => {
    setKeyword(event.target.value);
  }

  const handlePhrase = event => {
    setPhrase(event.target.value);
  }

  return (
    <div className="App">
      <h3><a href='https://en.wikipedia.org/wiki/Playfair_cipher' target='_blank' rel='noreferrer'>Playfair Cipher</a></h3>
      <p className='desc'>This project goes back to the simpler times of creating secret codes as kids.</p>
      <p className='desc'>The <a href='https://en.wikipedia.org/wiki/Playfair_cipher' target='_blank' rel='noreferrer'>cipher</a> is a method of encrypting a message by hand using a keyword and a 5x5 table of non-repeating characters.</p>
      <p className='desc'>It is encrypted by keyword, thus can only be decrypted by the same keyword.</p>

      <div className='input-box'>
      <input placeholder='Keyword' onChange={handleKeyword} type='text'></input>

      <input placeholder='Secret Phrase' onChange={handlePhrase} type='text'></input>
      </div>

      <p className='small'>(For the sake of 25 characters, i = j)</p>
      <div className='square'>
        {cipher.map((data, index) => (
          <div key={index} className='block'>
            {
              index < length
                ? <p className='key'>{data}</p>
                : <p>{data}</p>
            }
          </div>
        ))}
      </div>

      <button onClick={encrypt}>Encrypt</button>

      {
        diPhrase
          ? <p><b>Digraph: </b>{diPhrase}</p>
          : ""
      }
      {
        encrypted
        ? <p><b>Result: </b>{encrypted}</p>
        : ""
      }
    </div>
  );
}

export default App;