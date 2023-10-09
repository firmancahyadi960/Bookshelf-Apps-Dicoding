let books = [];
const EVENT_CHANGE = "change-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
}

function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
  document.dispatchEvent(new Event("saved"));
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) books = data;

  document.dispatchEvent(new Event("loaded"));
}

function updateDataToStorage() {
  if (isStorageExist()) saveData();
}

function composeBookObject(
  essay,
  publisher,
  year,
  language,
  numberofpage,
  isbn,
  isCompleted
) {
  return {
    id: +new Date(),
    essay,
    publisher,
    year,
    language,
    numberofpage,
    isbn,
    isCompleted,
  };
}

function findBook(bookId) {
  for (book of books) {
    if (book.id === bookId) return book;
  }
  return null;
}

function findBookIndex(bookId) {
  let index = 0;
  for (book of books) {
    if (book.id === bookId) return index;

    index++;
  }
  return -1;
}

// BAGIAN SCRIPT

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("form");

  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  const searchBooks = document.getElementById("searchBook");

  searchBooks.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener("saved", () => {
  console.log("Data saved successfully.");
});
document.addEventListener("loaded", () => {
  refreshDataFromBooks();
});

// BAGIAN DOM MANIPULASION

const incomplete_Bookshelf_List = "not-is-complete";
const complete_Bookshelf_List = "complete-book";
const book_itemID = "itemId";

function addBook() {
  const incompleteBookshelfList = document.getElementById(
    incomplete_Bookshelf_List
  );
  const completeBookshelfList = document.getElementById(
    complete_Bookshelf_List
  );

  const inputBookEssay = document.getElementById("essay").value;
  const inputBookPublisher = document.getElementById("publisher").value;
  const inputBookYear = document.getElementById("year").value;
  const inputBookLanguage = document.getElementById("language").value;
  const inputBookNumberOfPage = document.getElementById("number").value;
  const inputBookIsbn = document.getElementById("isbn").value;
  const inputBookIsComplete = document.getElementById("isComplete").checked;

  const book = makeBook(
    inputBookEssay,
    inputBookPublisher,
    inputBookYear,
    inputBookLanguage,
    inputBookNumberOfPage,
    inputBookIsbn,
    inputBookIsComplete
  );
  const bookObject = composeBookObject(
    inputBookEssay,
    inputBookPublisher,
    inputBookYear,
    inputBookLanguage,
    inputBookNumberOfPage,
    inputBookIsbn,
    inputBookIsComplete
  );

  book[book_itemID] = bookObject.id;
  books.push(bookObject);

  if (inputBookIsComplete == false) {
    incompleteBookshelfList.append(book);
  } else {
    completeBookshelfList.append(book);
  }

  updateDataToStorage();
}

function makeBook(
  inputBookEssay,
  inputBookPublisher,
  inputBookYear,
  inputBookLanguage,
  inputBookNumberOfPage,
  inputBookIsbn,
  inputBookIsComplete
) {
  const bookEssay = document.createElement("h3");
  bookEssay.innerText = inputBookEssay;
  bookEssay.classList.add("move");

  const bookPublisher = document.createElement("p");
  bookPublisher.innerText = inputBookPublisher;

  const bookYears = document.createElement("p");
  bookYears.classList.add("year");
  bookYears.innerText = inputBookYear;

  const bookLanguage = document.createElement("label");
  bookLanguage.innerText = inputBookLanguage;

  const bookNumberOfPAge = document.createElement("p");
  bookNumberOfPAge.classList.add("number");
  bookNumberOfPAge.innerText = inputBookNumberOfPage;

  const bookIsbn = document.createElement("p");
  bookIsbn.classList.add("isbn");
  bookIsbn.innerText = inputBookIsbn;

  const bookIsComplete = createCompleteButton();

  const bookRemove = createRemoveButton();
  bookRemove.innerText = "Delete";

  const bookAction = document.createElement("div");
  bookAction.classList.add("action");
  if (inputBookIsComplete == true) {
    bookIsComplete.innerText = "Not finished yet";
  } else {
    bookIsComplete.innerText = "It's finished";
  }

  bookAction.append(bookIsComplete, bookRemove);
  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(
    bookEssay,
    bookPublisher,
    bookYears,
    bookLanguage,
    bookNumberOfPAge,
    bookIsbn,
    bookAction
  );

  return bookItem;
}

function createButton(buttonTypeClass, eventListener) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function createCompleteButton() {
  return createButton("button", function (event) {
    const parent = event.target.parentElement;
    addBookToCompleted(parent.parentElement);
  });
}

function removeBook(bookElement) {
  const bookPosition = findBookIndex(bookElement[book_itemID]);
  if (window.confirm("Would you like to remove this book from the shelf?")) {
    books.splice(bookPosition, 1);
    bookElement.remove();
  }
  updateDataToStorage();
}

function createRemoveButton() {
  return createButton("button", function (event) {
    const parent = event.target.parentElement;
    removeBook(parent.parentElement);
  });
}

function addBookToCompleted(bookElement) {
  const bookEssay_1 = bookElement.querySelector(".book_item > h3").innerText;
  const bookPublisher_1 = bookElement.querySelector(".book_item > p").innerText;
  const bookYear_1 = bookElement.querySelector(".year").innerText;
  const bookLanguage_1 =
    bookElement.querySelector(".book_item > label").innerText;
  const bookNumberOfPAge_1 = bookElement.querySelector(".number").innerText;
  const bookIsbn_1 = bookElement.querySelector(".isbn").innerText;
  const bookIsComplete = bookElement.querySelector(".button").innerText;

  if (bookIsComplete == "It's finished") {
    const newBook = makeBook(
      bookEssay_1,
      bookPublisher_1,
      bookYear_1,
      bookLanguage_1,
      bookNumberOfPAge_1,
      bookIsbn_1,
      true
    );

    const book = findBook(bookElement[book_itemID]);
    book.isCompleted = true;
    newBook[book_itemID] = book.id;

    const completeBookshelfList = document.getElementById(
      complete_Bookshelf_List
    );
    completeBookshelfList.append(newBook);
  } else {
    const newBook = makeBook(
      bookEssay_1,
      bookPublisher_1,
      bookYear_1,
      bookLanguage_1,
      bookNumberOfPAge_1,
      bookIsbn_1,
      false
    );

    const book = findBook(bookElement[book_itemID]);
    book.isCompleted = false;
    newBook[book_itemID] = book.id;

    const incompleteBookshelfList = document.getElementById(
      incomplete_Bookshelf_List
    );
    incompleteBookshelfList.append(newBook);
  }
  bookElement.remove();

  updateDataToStorage();
}

function refreshDataFromBooks() {
  const listUncompleted = document.getElementById(incomplete_Bookshelf_List);
  const listCompleted = document.getElementById(complete_Bookshelf_List);

  for (book of books) {
    const bookNew = makeBook(
      book.essay,
      book.publisher,
      book.year,
      book.language,
      book.numberofpage,
      book.isbn,
      book.isCompleted
    );
    bookNew[book_itemID] = book.id;

    if (book.isCompleted == false) {
      listUncompleted.append(bookNew);
    } else {
      listCompleted.append(bookNew);
    }
  }
}

function searchBook() {
  const inputSearch = document.getElementById("searchQuery").value;
  const moveBook = document.querySelectorAll(".move");

  for (move of moveBook) {
    if (inputSearch !== move.innerText) {
      console.log(move.innerText);
      move.parentElement.remove();
    }
  }
}
