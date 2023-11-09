﻿using AutoMapper;
using Grpc.Core;
using QuizMaster.API.Quiz.Protos;
using QuizMaster.API.Quiz.Services.Repositories;

namespace QuizMaster.API.Quiz.Services.GRPC
{
    public class TypeService : QuizTypeService.QuizTypeServiceBase
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IMapper _mapper;

        public TypeService(IQuizRepository quizRepository, IMapper mapper)
        {
            _quizRepository = quizRepository;
            _mapper = mapper;
        }

        public override async Task GetAllTypes(EmptyTypeRequest request, IServerStreamWriter<TypeReply> responseStream, ServerCallContext context)
        {
            var reply = new TypeReply();
            foreach (var difficulty in _quizRepository.GetAllTypesAsync().Result)
            {
                reply.Id = difficulty.Id;
                reply.QTypeDesc = difficulty.QTypeDesc;
                reply.QDetailRequired = difficulty.QDetailRequired;

                await responseStream.WriteAsync(reply);
            }
        }
    }
}
