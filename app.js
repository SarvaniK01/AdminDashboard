import { ArticlePosts } from "./data.js"; 
// console.log(ArticlePosts);

class File {
  static getPosts(){
    let aPosts;
    
    aPosts = ArticlePosts;

    aPosts.forEach((post) => {
      console.log(post.number);
    });

    // console.log(aPosts);
    return aPosts;
  }

  static addPosts(post) {
    const posts = File.getPosts();

    posts.push(post);

    ArticlePosts.setItem("ArticlePosts", JSON.stringify(posts));
  }

  static removePosts(number) {
    const posts = File.getPosts();

    posts.forEach((post, index) => {
      if (post.number === number) {
        posts.splice(index, 1);
      }
    });

    ArticlePosts.setItem("posts", JSON.stringify(posts));
  }

  static editPosts(number){
    const posts = File.getPosts();

    posts.forEach((post) => {
      if (post.number === number) {
        imageUrl.value = post.imageUrl;
        date.value = post.date;
        heading.value = post.heading;
        content.value = post.content;
      }
    });

  }

  static savePosts(number){
    const posts = File.getPosts();

    posts.forEach((post, index) => {
      if (post.number === number) {
        let values = posts[index];
        values.imageUrl = imageUrl.value;
        values.date = date.value;
        values.heading = heading.value;
        values.content = content.value;
        ArticlePosts.setItem("posts", JSON.stringify(posts));
      }
    });
  }
}

// Post Class : for a post
class Post {
  constructor(number, imageUrl, date, heading, content) {
    this.number = number;
    this.imageUrl = imageUrl;
    this.date = date;
    this.heading = heading;
    this.content = content;
  }
}

// UI Class: Handle UI Tasks

class UI {
    static displayPosts(){
      // const posts = Store.getPosts();
      const posts = File.getPosts();

      posts.forEach((post) => UI.addPostToList(post))
    }
  
    static addPostToList(post) {
      const list = document.querySelector("#postDiv");
      const row = document.createElement("div");
      row.className = "col-sm-12 col-md-6 col-lg-6 gap-3 justify-content-evenly my-5";
      row.id = "separatePost";

      row.innerHTML = `
            <div class="post mx-4">
                <h6 class="mt-3 fw-bolder text-success invisible">${post.number}</h6>
                <span id="contentBox">
                    <h5 class="mt-3 fw-bolder text-primary">${post.date}</h5>
                    <img class="img-thumbnail mt-2" src=${post.imageUrl} alt="...">
                    <h3 class="my-4">${post.heading}</h3>
                    <p class="mb-5">${post.content}</p>
                </span>

                <div class="d-flex justify-content-end gap-2">
                    <button type="button" class="btn btn-outline-success edit-button">Edit</button>
                    <button class="btn btn-danger delete">Delete</button>
                </div>
            </div>
        `;

      list.appendChild(row);
  }

    // <button type="button" class="btn btn-outline-success save-button">Save Changes</button>

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#postForm");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#number").value = "";
    document.querySelector("#imageUrl").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#heading").value = "";
    document.querySelector("#content").value = "";
  }
}

// Store Class: Handles Storage
class Store {
  static getPosts() {
    let posts;
    if (localStorage.getItem("posts") === null) {
      posts = [];
    } else {
      posts = JSON.parse(localStorage.getItem("posts"));
    }

    return posts;
  }

  static addPosts(post) {
    const posts = Store.getPosts();

    posts.push(post);

    localStorage.setItem("posts", JSON.stringify(posts));
  }

  static removePosts(number) {
    const posts = Store.getPosts();

    posts.forEach((post, index) => {
      if (post.number === number) {
        posts.splice(index, 1);
      }
    });

    localStorage.setItem("posts", JSON.stringify(posts));
  }

  static editPosts(number){
    const posts = Store.getPosts();

    posts.forEach((post) => {
      if (post.number === number) {
        imageUrl.value = post.imageUrl;
        date.value = post.date;
        heading.value = post.heading;
        content.value = post.content;
      }
    });

  }

  static savePosts(number){
    const posts = Store.getPosts();

    posts.forEach((post, index) => {
      if (post.number === number) {
        let values = posts[index];
        values.imageUrl = imageUrl.value;
        values.date = date.value;
        values.heading = heading.value;
        values.content = content.value;
        localStorage.setItem("posts", JSON.stringify(posts));
      }
    });
  }
}

// Event: Display posts
document.addEventListener("DOMContentLoaded", UI.displayPosts);

// Event : Add a Post
document.querySelector("#postForm").addEventListener("submit", (e) => {
  // Prevent Actual Submit
  e.preventDefault();

  // Get form Values
  const number = document.querySelector("#number").value;
  const imageUrl = document.querySelector("#imageUrl").value;
  const date = document.querySelector("#date").value;
  const heading = document.querySelector("#heading").value;
  const content = document.querySelector("#content").value;

  // Validate
  if (
    number === "" ||
    imageUrl === "" ||
    date === "" ||
    heading === "" ||
    content === ""
  ) {
    UI.showAlert("Please fill in all the fields", "danger");
  } else {
    // Instantiate Post
    const post = new Post(number, imageUrl, date, heading, content);

    // console.log(post);

    // Add Book to UI
    UI.addPostToList(post);

    // Add book to Store
    // Store.addPosts(post);
    File.addPosts(post);

    // Show success message
    UI.showAlert("Post Added", "success");

    // Clear fields
    UI.clearFields();
  }
});


// Event : Delete, Edit and Save Changes
document.querySelector("#postDiv").addEventListener("click", (e) => {
    const button = e.target;
    const buttonDiv = button.parentElement;
    const contentDiv = buttonDiv.parentElement;
    const container = contentDiv.parentElement;

    // delete Post 
    if (button.textContent === "Delete") {
      // UI delete function
      container.removeChild(contentDiv);

      // localStorage delete function
      // Store.removePosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
      File.removePosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

        
      UI.showAlert("Post Deleted", "success");
    }

    // edit function
    else if(button.textContent === 'Edit'){

      // localStorage edit function
      // Store.editPosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
      File.editPosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

      // change the button textcontent to "Save Changes"
      button.textContent = "Save Changes";
    }

    // save changes function
    else if(button.textContent === 'Save Changes'){

      // localStorage save function
      // Store.savePosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
      File.savePosts(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

      // change the button textcontent back to "Edit"
      button.textContent = "Edit";
      UI.showAlert("Saved Changes", "success");
      UI.clearFields();
      location.reload();
    }  
});
