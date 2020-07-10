import { MyEvent } from './MyEvent';
import { Client } from '@dolittle/sdk';
import { MyEventHandler } from './MyEventHandler';

import { Cancellation } from '@dolittle/sdk.services';
import { ReverseCallClient } from '@dolittle/sdk.services';
import { EventHandlerClientToRuntimeMessage, EventHandlerRuntimeToClientMessage, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_pb';
import { ProcessorFailure } from '@dolittle/runtime.contracts/Runtime/Events.Processing/Processors_pb';

import { Guid } from '@dolittle/rudiments';
import { guids, artifacts } from '@dolittle/sdk.protobuf';
import { Artifact } from '@dolittle/sdk.artifacts';
import { EventContext } from '@dolittle/sdk.events';

const client = Client
                    .for('7a6155dd-9109-4488-8f6f-c57fe4b65bfb')
                    .withEventHandlers(_ => {
                        _.from(MyEventHandler);
                        _.for('a0be3ef0-113f-45a6-800e-061d375407c1', ehb => {
                            ehb.handle(MyEvent, (myEvent: MyEvent, context: EventContext) => {
                                console.log('Handled and happy');
                            });
                        });
                    })
                    .build();
client.executionContextManager.currentFor('900893e7-c4cc-4873-8032-884e965e4b97');

// const handlersClient = client.eventHandlers.eventHandlersClient;
// const reactive = new ReactiveGrpc();

// const connectArguments = new EventHandlerRegistrationRequest();

// connectArguments.setScopeid(guids.toProtobuf(Guid.empty));
// //connectArguments.setEventhandlerid(guids.toProtobuf(Guid.parse('f734d633-86fe-4e92-bf7a-46ff8c5d7997')));
// connectArguments.setEventhandlerid(guids.toProtobuf(Guid.parse('f734d633-86fe-4e92-bf7a-46ff8c5d7990')));
// connectArguments.setPartitioned(true);

// const types = [new Artifact('c7b37f26-ffe4-4ffc-9a53-8d67acbecd4d', 1)].map(artifact => artifacts.toProtobuf(artifact));
// connectArguments.setTypesList(types);

// const reverseCallClient = new ReverseCallClient<EventHandlerClientToRuntimeMessage, EventHandlerRuntimeToClientMessage, EventHandlerRegistrationRequest, EventHandlerRegistrationResponse, HandleEventRequest, EventHandlerResponse> (
//     (requests, cancellation) => reactive.performDuplex(handlersClient, handlersClient.connect, requests, cancellation),
//     EventHandlerClientToRuntimeMessage,
//     (message, connectArguments) => message.setRegistrationrequest(connectArguments),
//     (message) => message.getRegistrationresponse(),
//     (message) => message.getHandlerequest(),
//     (message, response) => message.setHandleresult(response),
//     (connectArguments, context) => connectArguments.setCallcontext(context),
//     (request) => request.getCallcontext(),
//     (response, context) => response.setCallcontext(context),
//     (message) => message.getPing(),
//     (message, pong) => message.setPong(pong),
//     client.executionContextManager,
//     connectArguments,
//     1,
//     (request) => {
//         console.log('Got handle event request', request.getEvent()?.getEvent()?.getContent(), request.getRetryprocessingstate()?.getRetrycount(), guids.toSDK(request.getCallcontext()?.getExecutioncontext()?.getTenantid()).toString());
//         const response = new EventHandlerResponse();
//         const failure = new ProcessorFailure();
//         failure.setReason('Hi');
//         failure.setRetry(true);
//         const retryTimeout = new Duration();
//         retryTimeout.setSeconds(10);
//         failure.setRetrytimeout(retryTimeout)
//         response.setFailure(failure);
//         return response;
//     },
//     Cancellation.default,
//     client.logger
// );

// reverseCallClient.subscribe({
//     next: (value) => {
//         console.log('Registration response', value);
//     },
//     error: (error) => {
//         console.log('Registration error', error);
//     },
//     complete: () => {
//         console.log('Registration complete');
//     }
// });

// const event = new MyEvent();
// event.anInteger = 42;
// event.aString = 'Forty two';
// client.eventStore.commit(event, 'd8cb7301-4bec-4451-a72b-2db53c6dc05d');
