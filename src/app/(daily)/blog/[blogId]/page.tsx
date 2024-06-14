import React, { memo } from 'react';

const BlogDetail = (props: { params: { blogId: string } }) => {
  return <div>博客ID: {props.params.blogId}</div>;
};

export default BlogDetail;
