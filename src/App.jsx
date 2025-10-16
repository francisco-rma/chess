import './App.css'
import TagInput from './TagInput'
import Form from './Form'
import ControlledForm from './ControlledForm'
import TicTacToe from './TicTacToe'
import Chess from './Chess'


const App = () => {
  return (
    <div className="content">
      <div className='games'>
        <Chess color={'black'} />
      </div>
    </div>
  )
}

export default App
