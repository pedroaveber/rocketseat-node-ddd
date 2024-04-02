import { InMemoryAnswerCommentsRepository } from 'test/respositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'

let sut: DeleteAnswerCommentUseCase
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a answer comment', async () => {
    const answerComment = makeAnswerComment()
    inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerCommentsRepository.answerComments).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    const answerComment = makeAnswerComment()
    inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'another-author-id',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(NotAllowedError)
  })
})
