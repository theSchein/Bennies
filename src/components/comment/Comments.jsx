// import { useState, useRef, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import DownArrow from "../assets/down-arrow.svg";
// import UpArrow from "../assets/up-arrow.svg";

// function Comment({ comment, nft }) {
//   const { data: session } = useSession();
//   const [input, setInput] = useState("");
//   const [editMode, setEditMode] = useState(false);
//   const [showInput, setShowInput] = useState(false);
//   const [expand, setExpand] = useState(false);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [editMode]);

//   const handleNewComment = () => {
//     setExpand(!expand);
//     setShowInput(true);
//   };

//   const onAddComment = () => {
//     if (session) {
//         e.preventDefault();

//         const data = {
//             nft_id: nft.nft_id,
//             text: text,
//             parentCommentId: comment.parent_comment_id || null,
//         };

//         fetch("/api/comments/createComments", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 credentials: "include",
//             },
//             body: JSON.stringify({ data }),
//         })
//             .then((response) => response.json())
//             .then((newComment) => {
//                 setText("");
//                 setComments((prevComments) => [...prevComments, newComment]);
//                 setShowInput(false);
//                 setReloadComments(!reloadComments);
//             })
//             .catch((error) =>
//                 console.error(
//                     "There was an error saving the comment:",
//                     error,
//                 ),
//             );
//     } else { alert("Please sign in to comment") }

//     // if (editMode) {
//     //   handleEditNode(comment.id, inputRef.current.innerText);
//     // } else {
//     //   setExpand(true);
//     //   handleInsertNode(comment.id, input);
//     //   setShowInput(false);
//     //   setInput("");
//     // }


// //     if (editMode) setEditMode(false);
// //   };


// //   const handleDelete = () => {
// //     handleDeleteNode(comment.id);
// //   };


//   return (
//     <div>
//       <div className={comment.parent_comment_id === null ? "inputContainer" : "commentContainer"}>
//         {comment.parent_comment_id === null ? (
//           <>
//             <input
//               type="text"
//               className="inputContainer__input first_input"
//               autoFocus
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="type..."
//             />

//             <Action
//               className="reply comment"
//               type="COMMENT"
//               handleClick={onAddComment}
//             />
//           </>
//         ) : (
//           <>
//             <span
//               contentEditable={editMode}
//               suppressContentEditableWarning={true}
//               ref={inputRef}
//               style={{ wordWrap: "break-word" }}
//             >
//               {comment.text}
//             </span>

//             <div style={{ display: "flex", marginTop: "5px" }}>
//               {editMode ? (
//                 <>
//                   <Action
//                     className="reply"
//                     type="SAVE"
//                     handleClick={onAddComment}
//                   />
//                   <Action
//                     className="reply"
//                     type="CANCEL"
//                     handleClick={() => {
//                       if (inputRef.current)
//                         inputRef.current.innerText = comment.name;
//                       setEditMode(false);
//                     }}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <Action
//                     className="reply"
//                     type={
//                       <>
//                         {expand ? (
//                           <UpArrow width="10px" height="10px" />
//                         ) : (
//                           <DownArrow width="10px" height="10px" />
//                         )}{" "}
//                         REPLY
//                       </>
//                     }
//                     handleClick={handleNewComment}
//                   />
//                   <Action
//                     className="reply"
//                     type="EDIT"
//                     handleClick={() => {
//                       setEditMode(true);
//                     }}
//                   />
//                   <Action
//                     className="reply"
//                     type="DELETE"
//                     handleClick={handleDelete}
//                   />
//                 </>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
//         {showInput && (
//           <div className="inputContainer">
//             <input
//               type="text"
//               className="inputContainer__input"
//               autoFocus
//               onChange={(e) => setInput(e.target.value)}
//             />
//             <Action className="reply" type="REPLY" handleClick={onAddComment} />
//             <Action
//               className="reply"
//               type="CANCEL"
//               handleClick={() => {
//                 setShowInput(false);
//                 if (!comment?.items?.length) setExpand(false);
//               }}
//             />
//           </div>
//         )}

//         {comment?.items?.map((cmnt) => (
//           <Comment
//             key={cmnt.id}
//             handleInsertNode={handleInsertNode}
//             handleEditNode={handleEditNode}
//             handleDeleteNode={handleDeleteNode}
//             comment={cmnt}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comment;
