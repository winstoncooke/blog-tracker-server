import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import { setFilter } from '../reducers/filterReducer'

const Anecdote = ({ anecdote, handleClick }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                Votes: {anecdote.votes} &nbsp;
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}



const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        const filter = state.filter.toLowerCase()
        if (filter === '') {
            return state.anecdotes
        } else {
            return state.anecdotes.filter(n => n.content.toLowerCase().includes(filter))
        }
    })

    const addVote = (anecdote) => {
        dispatch(vote(anecdote.id))
        dispatch(setNotification(`you voted "${anecdote.content}"`, 5))
    }

    return (
        <ul>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleClick={() => addVote(anecdote)}
                />
            )}
        </ul>
    )
}

export default AnecdoteList
