import { useRef } from 'react';
import './App.css';

const App = () => {
  return (
    <div className="content">
      <h1>Hello, World</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <Form />
      <TagInput />
    </div>
  )
};

function Form() {
  const form = useRef(null);

  const click = (event) => {
    const formData = new FormData(form.current);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  }

  const submit = (event) => {
    event.preventDefault();
    console.log(form.current === event.target);
  }

  return (
    <form ref={form} className='form' id='myForm' onSubmit={submit}>
      <input id='sometext' name='sometext' type='text' placeholder='some text'></input>
      <button aria-label='click' type='button' onClick={click}>
        <span>Click</span>
      </button>
      <button aria-label='submit' type='submit'>
        <span>Submit</span>
      </button>
    </form>
  )
}

function TagInput() {
  const tags = [];
  const form = useRef(null);

  const submit = (event) => {
    event.preventDefault();
    addTag();
  }
  
  function addTag() {
    const formData = new FormData(form.current);
    const name = formData.get('tagName');
    console.log('Tag name: ', name);
    tags.push(name);
    console.log('Current tags:', tags);
  }

  const keywords = ['Enter', ','];
  const keyListen = (event) => {
    if (keywords.includes(event.key)) {
      event.preventDefault();
      if (event.key === ',') {
        event.stopPropagation();
      }
      addTag();
    }
  }
  const keyLock = (event) => {
    if (event.key === ',') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  return (
    <form ref={form} className='form' onSubmit={submit}>
      <input name='tagName' type='text' placeholder='tag name' onKeyDown={keyLock} onKeyUp={keyListen}></input>
      <button className='square'>
        <span>Generate tag</span>
      </button>
    </form>
  )
}

export default App;
