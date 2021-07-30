import './Button.scss'

export const Button = ({ title, type = "button", disabled = false, onClick }) => {
    return (
        <>
            <button
                className="app-button"
                disabled={disabled}
                onClick={onClick}
                type={type}
            >
                {title}
            </button>
        </>
    )
}