import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "./MarkdownViewer.module.css"; // Import corretto

const MarkdownViewer = ({ content }) => {
    return (
        <div className={styles.markdownContainer}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownViewer;
