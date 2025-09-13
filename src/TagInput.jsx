import { useState } from "react"


function TagInput() {
  const [inputValue, setInputValue] = useState('')
  const [tags, setTags] = useState([])

  const addTag = (name) => {
    const trimmed = name.trim()
    if (trimmed && !tags.includes(trimmed)) {
      console.log('adding ', trimmed, 'to ', tags)
      setTags([...tags, trimmed])
      setInputValue('')
    }
  }

  const removeTag = (name) => {
    setTags(tags.filter(tag => tag !== name))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addTag(inputValue)
  }

  const keywords = ['Enter', ',']

  const handleKeyUp = (event) => {
    if (keywords.includes(event.key)) {
      event.preventDefault()
      addTag(inputValue)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === ',') {
      event.preventDefault()
    }
  }

  return (
    <div>
      <form className='form' onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          name='tagName'
          type='text'
          placeholder='tag name'
        ></input>
        <button>
          <span>Generate tag</span>
        </button>
      </form>
      {tags.map((tag, index) => (
        <div class='tag'>
          <span key={`${index}:${tag}`}>
            {index}:{tag}
          </span>
          <button className='close-button' onClick={() => removeTag(tag)}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}

export default TagInput