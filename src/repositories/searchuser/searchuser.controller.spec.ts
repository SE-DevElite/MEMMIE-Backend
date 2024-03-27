import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './searchuser.controller';
import { SearchService } from './searchuser.service';

describe('SearchUserController', () => {
  let searchcontroller: SearchController;
  let searchservice: SearchService;

  beforeEach(async () => {
    const searchmodule: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [SearchService],
    }).compile();

    searchcontroller = searchmodule.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(searchcontroller).toBeDefined();
  });

  const mockusername = 'Chutphon';

  describe('search user by username', () => {
    it('should return Users', async () => {
      const response = await searchcontroller.searchUsers(mockusername);
      expect(response).toEqual(
        expect.arrayContaining([{ username: mockusername }]),
      );
    });
  });
});
