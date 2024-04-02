import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public answerComments: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.answerComments.push(answerComment)
  }

  async findById(id: string) {
    const answerCommentById = this.answerComments.find(
      (answerComment) => answerComment.id.toString() === id,
    )

    if (!answerCommentById) {
      return null
    }

    return answerCommentById
  }

  async delete(answerCommentToDelete: AnswerComment) {
    const answerCommentIndex = this.answerComments.findIndex(
      (answerCommen) => answerCommen.id === answerCommentToDelete.id,
    )

    this.answerComments.splice(answerCommentIndex, 1)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const commentsByAnswerId = this.answerComments
      .filter((answerComment) => answerComment.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return commentsByAnswerId
  }
}
