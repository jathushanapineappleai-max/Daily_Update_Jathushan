import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "../../styles/admin_panel/custom_toolbar.css";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Image,
  Paperclip,
} from "lucide-react";

export default function CustomToolbar() {
  return (
    <div id="custom-toolbar" className="ql-toolbar ql-snow custom-toolbar">
      {/* 1. Font Style */}
      <select className="ql-font" defaultValue="">
        <option value="">Default</option>
        <option value="source-sans-pro">Source Sans Pro</option>
        <option value="raleway">Raleway</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>

      {/* 2. Font Size */}
      <select className="ql-size" defaultValue="">
        <option value="small">Normal</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="huge">Extra</option>
      </select>

      {/* 3. Bold */}
      <button className="ql-bold" title="Bold">
        <Bold size={16} />
      </button>

      {/* 4. Italic */}
      <button className="ql-italic" title="Italic">
        <Italic size={16} />
      </button>

      {/* 5. Underline */}
      <button className="ql-underline" title="Underline">
        <Underline size={16} />
      </button>

      {/* 6. Strikethrough */}
      <button className="ql-strike" title="Strikethrough">
        <Strikethrough size={16} />
      </button>

      {/* 7. Font Color */}
      <select className="ql-color" title="Font Color"></select>

      {/* 8. Background / Highlighter */}
      <select className="ql-background" title="Highlighter"></select>

      {/* 9. Ordered List */}
      <button className="ql-list" value="ordered" title="Numbered List"></button>

      {/* 10. Bullet List */}
      <button className="ql-list" value="bullet" title="Bullet List"></button>

      {/* 11. Left Align */}
      <button className="ql-align" value="" title="Left Align"></button>

      {/* 12. Right Align */}
      <button className="ql-align" value="right" title="Right Align"></button>

      {/* 13. Subscript */}
      <button className="ql-script" value="sub" title="Subscript"></button>

      {/* 14. Superscript */}
      <button className="ql-script" value="super" title="Superscript"></button>

      {/* 15. Pin Document */}
      <button className="ql-pin" title="Pin Document">
        <Paperclip size={16} />
      </button>

      {/* 16. Insert Image */}
      <button className="ql-image" title="Insert Image">
        <Image size={16} />
      </button>
    </div>
  );
}
