﻿using AutoMapper;
using Grpc.Core;
using Grpc.Net.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using QuizMaster.API.Gateway.Configuration;
using QuizMaster.API.Quiz.Models;
using QuizMaster.API.Quiz.Protos;

namespace QuizMaster.API.Gateway.Controllers
{
    [ApiController]
    [Route("api/gateway/question/type")]
    public class QuestionTypeGatewayController : Controller
    {
        private readonly IMapper _mapper;
        private readonly GrpcChannel _channel;
        private readonly QuizTypeService.QuizTypeServiceClient _channelClient;

        public QuestionTypeGatewayController(IMapper mapper, IOptions<GrpcServerConfiguration> options)
        {
            _mapper = mapper;
            _channel = GrpcChannel.ForAddress(options.Value.Quiz_Category_Service);
            _channelClient = new QuizTypeService.QuizTypeServiceClient(_channel);
        }

        [HttpGet("get_all_type")]
        public async Task<IActionResult> GetAllType()
        {
            var request = new EmptyTypeRequest();
            var response = _channelClient.GetAllTypes(request);
            var types = new List<TypeDto>();
            while (await response.ResponseStream.MoveNext())
            {
                types.Add(_mapper.Map<TypeDto>(response.ResponseStream.Current));
            }
            return Ok(types);
        }
    }
}
