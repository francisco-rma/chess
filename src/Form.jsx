import { useRef } from 'react'

function Form() {
  const form = useRef(null)

  const click = (event) => {
    const formData = new FormData(form.current)
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }
  }

  const submit = (event) => {
    event.preventDefault()
    console.log(form.current === event.target)
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

export default Form