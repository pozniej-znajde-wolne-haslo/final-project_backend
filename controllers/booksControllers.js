import BookModel from '../models/Book.js';
import GenreModel from '../models/Genre.js';

const createBook = async (req, res, next) => {
  try {
    const fileName = Date.now() + '_' + req.files.image.name;
    const data = {
      title: req.body.title,
      author: req.body.combinedName,
      year: parseInt(req.body.year),
      publisher: req.body.publisher,
      genre: req.body.genre,
      description: req.body.description,
      price: parseFloat(req.body.price),
      ISBN: req.body.isbn,
      image: {
        fileName: fileName,
        data: req.files.image.data,
        thumbnail: `${process.env.THUMBNAIL}${fileName}`,
      },
    };
    const book = await BookModel.create(data);

    const genre = await GenreModel.findOne({ genre: req.body.genre });
    if (!genre) {
      const genre = await GenreModel.create({ genre: req.body.genre });
    }

    res.json({ success: true, message: 'The book was uploaded successfully.' });
  } catch (error) {
    next(error);
  }
};

const genreBook = async (req, res, next) => {
  try {
    const books = await BookModel.find({ genre: req.body.genre }).select({
      title: 1,
      author: 1,
      year: 1,
      publisher: 1,
      genre: 1,
      description: 1,
      avgRating: 1,
      price: 1,
      ISBN: 1,
      'image.thumbnail': 1,
    });
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookModel.find().select({
      title: 1,
      author: 1,
      year: 1,
      publisher: 1,
      genre: 1,
      description: 1,
      avgRating: 1,
      price: 1,
      ISBN: 1,
      'image.thumbnail': 1,
    });
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

// use select here (not fetching reviews ?)
const getBookById = async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id);
    res.send({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await BookModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'The book was successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

const searchBook = async (req, res, next) => {
  try {
    const unPlused = req.params.regex.replaceAll('+', ' ');
    //console.log(unPlused[unPlused.length -1])
    const book = await BookModel.find({
      $or: [
        { title: { $regex: unPlused } },
        { author: { $regex: unPlused } },
        //{ 'author.firstName': { $regex: unPlused[0] } },
        //{ 'author.lastName': { $regex: unPlused[unPlused.length -1] } },
      ],
    });
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export {
  createBook,
  genreBook,
  getAllBooks,
  searchBook,
  updateBook,
  deleteBook,
  getBookById,
};
