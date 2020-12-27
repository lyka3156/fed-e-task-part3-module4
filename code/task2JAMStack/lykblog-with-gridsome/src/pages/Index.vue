<template>
  <Layout>
    <!-- Page Header -->
    <header
      class="masthead"
      :style="{
        backgroundImage: `url(http://localhost:1337${general.cover.url})`,
      }"
    >
      <div class="overlay"></div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <div class="site-heading">
              <h1>{{ general.title }}</h1>
              <span class="subheading">{{ general.subtitle }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div
            class="post-preview"
            v-for="edge in $page.posts.edges"
            :key="edge.node.id"
          >
            <g-link :to="`/post/${edge.node.id}`">
              <h2 class="post-title">
                {{ edge.node.title }}
              </h2>
              <!-- <h3 class="post-subtitle">
                {{ edge.node.content }}
              </h3> -->
            </g-link>
            <p class="post-meta">
              Posted by
              <g-link to="/about">lyk</g-link>
              on
              {{ edge.node.created_at | date("MMMM DD, YYYY") }}
            </p>
            <!-- 标签 -->
            <p>
              <span v-for="tag in edge.node.tags" :key="tag.id">
                <g-link :to="`/tag/${tag.id}`">
                  {{ tag.title }}
                </g-link>
                &nbsp; &nbsp;
              </span>
            </p>
          </div>
          <hr />
          <hr />
          <!-- Pager -->
          <!-- <div class="clearfix">
            <a class="btn btn-primary float-right" href="#"
              >Older Posts &rarr;</a
            >
          </div> -->
          <Pager :info="$page.posts.pageInfo" />
        </div>
      </div>
    </div>
  </Layout>
</template>

<page-query>
query($page: Int) {
  posts: allStrapiPost(perPage: 2, page: $page,order:ASC) @paginate {
    pageInfo {
      totalPages
      currentPage
    }
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
      }
    }
  }

  general : allStrapiGeneral{
    edges{
      node{
        id,
        title,
        subtitle,
        cover{
          url
        }
      }
    }
  }
}
</page-query>

<script>
// 引入Pager页面组件
import { Pager } from "gridsome";
export default {
  metaInfo: {
    title: "My Blog",
  },
  name: "HomePage",
  components: {
    Pager,
  },
  computed: {
    general() {
      return this.$page.general.edges[0].node;
    },
  },
};
</script>

<style>
</style>
