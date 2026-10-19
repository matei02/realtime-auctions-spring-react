//package fontys.individual.persistence.impl;
//
//import fontys.individual.domain.classes.Painting;
//import fontys.individual.persistence.ArtRepository;
//import fontys.individual.persistence.entity.ArtEntity;
//import org.springframework.stereotype.Repository;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//@Repository
//public class FakeArtRepositoryImpl implements ArtRepository {
//
//    private static long NEXT_ID = 1;
//    private final List<ArtEntity> savedPaintings;
//
//    public FakeArtRepositoryImpl() {
//        this.savedPaintings = new ArrayList<>();
//    }
//
//    @Override
//    public boolean existsById(long id) {
//        return this.savedPaintings
//                .stream()
//                .anyMatch(ArtEntity -> ArtEntity.getId() == id);
//    }
//
//    @Override
//    public boolean existsByName(String name) {
//        return this.savedPaintings
//                .stream()
//                .anyMatch(ArtEntity -> ArtEntity.getName().equals(name));
//    }
//
//    @Override
//    public ArtEntity findById(long id) {
//        return this.savedPaintings
//                .stream()
//                .filter(ArtEntity -> ArtEntity.getId() == id)
//                .findFirst()
//                .orElse(null);
//    }
//
//    @Override
//    public List<ArtEntity> findAll() {
//        return Collections.unmodifiableList(savedPaintings);
//    }
//
//    @Override
//    public ArtEntity save(ArtEntity entity) {
//        if (entity.getId() == null)
//        {
//            entity.setId(NEXT_ID);
//            NEXT_ID++;
//            this.savedPaintings.add(entity);
//        }
//        return entity;
//    }
//
//    @Override
//    public void deletePaintingById(long id) {
//        savedPaintings.remove(findById(id));
//    }
//
//    @Override
//    public void updatePainting(long id, Painting painting)
//    {
//        if (findById(id) != null)
//        {
//            ArtEntity entity = findById(id);
//            entity.setName(painting.getName());
//            entity.setPrice(painting.getPrice());
//            entity.setLength(painting.getLength());
//            entity.setWidth(painting.getWidth());
//        }
//    }
//
//    @Override
//    public int count() {
//        return  this.savedPaintings.size();
//    }
//}
