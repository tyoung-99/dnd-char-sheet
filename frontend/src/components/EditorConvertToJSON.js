// Uses react-draft-wysiwyg for a textbox converting to/from JSON

import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import axios from "axios";
import "../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorConvertToJSON = ({ defaultTextJSON, ...props }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [imgList, setImgList] = useState({});

  const getImgUrl = async (imgId) => {
    const newImgBlob = await axios.get(`/api/img/char/${imgId}`, {
      responseType: "blob",
    });
    return URL.createObjectURL(newImgBlob.data);
  };

  useEffect(() => {
    const loadData = async () => {
      if (defaultTextJSON) {
        try {
          const newImgList = {};
          for (const entity of Object.values(defaultTextJSON.entityMap)) {
            if (entity.type === "IMAGE") {
              const newImgUrl = await getImgUrl(entity.data.imgId);
              entity.data.src = newImgUrl;
              newImgList[newImgUrl] = entity.data.imgId;
            }
          }
          setImgList(newImgList);

          const contentState = convertFromRaw(defaultTextJSON);
          setEditorState(EditorState.createWithContent(contentState));
        } catch (error) {
          console.error("Error parsing default text JSON:", error);
        }
      }
    };
    loadData();
  }, [defaultTextJSON]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onBlur = () => {
    const contentJSON = convertToRaw(editorState.getCurrentContent());
    Object.values(contentJSON.entityMap).forEach((img) => {
      if (!img.data.imgId) img.data.imgId = imgList[img.data.src];
    });

    props.onBlur(contentJSON);

    let currentImgs = Object.values(contentJSON.entityMap)
      .filter((entity) => entity.type === "IMAGE")
      .map((img) => img.data.src);

    Object.entries(imgList).forEach(([url, id]) => {
      if (!currentImgs.includes(url)) {
        axios.post(`/api/img/char/${id}/remove`);
      }
    });
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const newImgId = (
      await axios.put("api/img/char/add", formData, {
        headers: { "content-type": "multipart/form-data" },
      })
    ).data;

    const newImgUrl = await getImgUrl(newImgId);

    setImgList((oldList) => {
      const newList = { ...oldList };
      newList[newImgUrl] = newImgId;
      return newList;
    });

    return {
      data: {
        link: newImgUrl,
      },
    };
  };

  return (
    <Editor
      {...props}
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      onBlur={onBlur}
      toolbar={{
        image: {
          uploadEnabled: true,
          uploadCallback: (file) => {
            return uploadImage(file);
          },
          previewImage: true,
          defaultSize: {
            height: 100,
            width: 100,
          },
        },
      }}
    />
  );
};

export default EditorConvertToJSON;
