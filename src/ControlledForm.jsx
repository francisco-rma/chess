import { useState } from "react"

function ControlledForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const handleChange = (event) => {
        console.log('Change detected:')
        console.log(event.target)
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const submit = async (event) => {
        console.log(event)
    }
    const handleSubmit = async (event) => {
        console.log(event.target)
        event.preventDefault()
        setIsSubmitting(true)
        try {
            await submit(event)
            console.log('Submitted...', formData)
            setFormData({
                name: "",
                email: "",
                message: ""
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name='name'
                    type='text'
                    placeholder='name'
                    value={formData.name}
                    onChange={handleChange}
                    required />
                <input
                    name='email'
                    type='text'
                    placeholder='email'
                    value={formData.email}
                    onChange={handleChange}
                    required />
                <input
                    name='message'
                    type='text'
                    placeholder='message'
                    value={formData.message}
                    onChange={handleChange}
                    required />
                <button
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}

export default ControlledForm