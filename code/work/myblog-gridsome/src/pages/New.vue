<template>
  <Layout>
    <div class="el-col el-col-18" style="padding-left: 10px">
      <section>
        <div style="min-height: 600px" class="">
          <div class="el-card is-never-shadow" style="min-height: 400px">
            <div class="el-card__header">
              <div>
                <span>{{ post.updated_at | date("YYYY.MM.DD") }} 更新</span>
              </div>
            </div>
            <div class="el-card__body">
              <div
                style="
                  font-size: 0.9rem;
                  line-height: 1.5;
                  color: rgb(96, 108, 113);
                "
              >
                发布 {{ post.created_at | date("YYYY.MM.DD HH:mm:ss") }}
                <br />
                更新 {{ post.updated_at | date("YYYY.MM.DD HH:mm:ss") }}
              </div>
              <div
                style="
                  font-size: 1.1rem;
                  line-height: 1.5;
                  color: rgb(48, 49, 51);
                  border-bottom: 1px solid rgb(228, 231, 237);
                  padding: 5px 0px;
                "
              >
                <pre style="font-family: 微软雅黑">{{ post.title }}</pre>
              </div>
              <div class="markdown-body" style="padding-top: 20px">
                {{ post.content }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </Layout>
</template>

<page-query>
query {
  posts: allStrapiPost(limit: 1,order:DESC) {
    edges{
      node{
        id,
    		title,
        content,
        tags{
          id,
          title
        },
        created_at,
        updated_at
      }
    }
  }

  general : allStrapiGeneral{
    edges{
      node{
        id,
        title,
        subtitle,
        githubUrl,
        blogUrl,
        cover{
          url
        }
      }
    }
  }
}
</page-query>

<script>
export default {
  name: "NewPage",
  computed: {
    post() {
      return this.$page.posts.edges[0].node;
    },
  },
  mounted() {
    console.log(this.$page.posts);
  },
};
</script>

<style>
</style>