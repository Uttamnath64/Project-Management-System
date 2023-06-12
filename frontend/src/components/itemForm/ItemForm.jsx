import "./style.css";

export default function ListItem({...prompt}){
    return(
        <div className="itemFrom">
            <h1 className="title">{prompt.title}</h1>
            <div className="inputBox">
                    <p className={"message "+prompt.error.Type}>{prompt.error.Message}</p>
                </div>
                
                <div className="inputBox">
                    {!prompt.isNew && (<input 
                        type="text"
                        name="id"
                        value={prompt.data.id}
                        placeholder="Id"
                        readOnly/>)}
                </div>
                <div className="inputBox">
                    <input 
                        type="text"
                        name="name"
                        onChange={(e)=>{prompt.setOnChange(e)}}
                        value={prompt.data.name}
                        placeholder="Name"
                        readOnly={prompt.isLoading}/>
                </div>
                <div className="inputBox">
                    <input 
                        type="text"
                        onChange={(e)=>{prompt.setOnChange(e)}}
                        value={prompt.data.price}
                        name="price"
                        placeholder="Price"
                        readOnly={prompt.isLoading}
                        />
                </div>
                <div className="inputBox">
                    <textarea 
                        type="text"
                        onChange={(e)=>{prompt.setOnChange(e)}}
                        value={prompt.data.description}
                        name="description"
                        placeholder="Description"
                        readOnly={prompt.isLoading}
                        />
                </div>
                  
                <div className="inputBox btns">
                    <button type="button" className="btn close"  disabled={prompt.isLoading} onClick={prompt.onClose}>Close</button>
                    <button type="button" className="btn" disabled={prompt.isLoading} onClick={prompt.onSubmit}>{!prompt.isLoading ? (prompt.btnText):(prompt.btnTextProcess)}</button>
                </div>
        </div>
    );
}