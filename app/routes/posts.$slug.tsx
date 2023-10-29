import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";
import { getPost, likePost } from "~/models/post.server";
import { Button, links as ButtonLinks } from "~/components/atoms/button";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");
  const post = await getPost(params.slug);
  invariant(post, `Post not found: ${params.slug}`);
  const html = marked(post.markdown);
  return json({ post, html });
};

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();

  let values = Object.fromEntries(formData);
  const postId = String(formData.get("post"));
  const likeCount = Number(values.likeCount) + 1;

  await likePost({ id: postId, likeCount });
  return values;
}

export const links: LinksFunction = () => [...ButtonLinks()];

export default function PostSlug() {
  const { post, html } = useLoaderData<typeof loader>();

  return (
    <main>
      <h1>Some Post: {post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div>Post likes: {post.likeCount}</div>
      <Form method="post">
        <input type="hidden" name="likeCount" value={post.likeCount} />
        <input type="hidden" name="post" value={post.id} />
        <Button variant="outlined" isInverse={true} type="submit">
          Submit
        </Button>
      </Form>
    </main>
  );
}
