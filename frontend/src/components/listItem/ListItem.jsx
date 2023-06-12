import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import "./style.css";

export default function ListItem({...prompt}){
    return(
        <div className="item">
            <h2 className="title">{prompt.title}</h2>
            <p className="description">{prompt.description}</p>
            <div className="row">    
                <p className="price">Price: ${prompt.price}</p>
                <div className="btns">
                    <button className="btn click-hover" onClick={prompt.editBtn}>
                        <EditIcon/>
                    </button>
                    <button className="btn click-hover" onClick={prompt.deleteBtn}>
                        <DeleteIcon/>
                    </button>
                </div>
            </div>
        </div>
    );
}