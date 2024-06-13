import React, { memo } from 'react';

const Others = (props: { params: { slug: string } }) => {
  console.log('props.params.slug', props.params.slug);
  return <div>其他: {JSON.stringify(props.params.slug)}</div>;
};

export default Others;
