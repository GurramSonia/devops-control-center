function Toast(props:{message:string | null}){
    if (!props.message) return null;
        return(
            <div className="toast-class"
            >
                {props.message}
            </div>
    
        )
}
export default Toast;