import './App.css';

const App = () => {
  const layout = (
    <div className="content">
      <h1>Hello, World</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <Form />
    </div>
  );
  return layout;
};

function click(value) {
  console.log('this was a click');
  const myForm = value.view.document.getElementById('myForm');
  console.log('this is my form:', myForm);
  const formData = new FormData(myForm);
  console.log('this is my form data:', formData);
}

function submit(event) {
  event.preventDefault();
  console.log('Event:', event);
}

function Form() {
  return (
    <form className='form' id='myForm' onSubmit={submit}>
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

export default App;
